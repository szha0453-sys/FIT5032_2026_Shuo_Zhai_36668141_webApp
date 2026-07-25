import { computed, readonly, ref } from 'vue'

const STORAGE_VERSION = 1
const ACCOUNTS_KEY = 'silvercare:accounts'
const PERSISTENT_SESSION_KEY = 'silvercare:session'
const TAB_SESSION_KEY = 'silvercare:tab-session'
const USER_ROLE = 'user'
const STAFF_ROLE = 'staff'
const VALID_ROLES = new Set([USER_ROLE, STAFF_ROLE])
const DEFAULT_USER_ID = 'silvercare-default-user'
const DEFAULT_USER_CREDENTIAL_VERSION = 1
const DEFAULT_STAFF_ID = 'silvercare-default-staff'
const DEFAULT_STAFF_CREDENTIAL_VERSION = 2

const currentUserState = ref(null)
const isInitialised = ref(false)

export const currentUser = readonly(currentUserState)
export const isAuthenticated = computed(() => Boolean(currentUserState.value))
export const isStaff = computed(() => currentUserState.value?.role === STAFF_ROLE)
const defaultUserCredentials = Object.freeze({
  email: 'user@monash.edu',
  password: 'User123!',
})
const defaultStaffCredentials = Object.freeze({
  email: 'staff@monash.edu',
  password: 'Staff123!',
})

function getStorage(type) {
  if (typeof window === 'undefined') return null

  try {
    return type === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

function safeRemove(storage, key) {
  try {
    storage?.removeItem(key)
  } catch {
    // Authentication falls back to a signed-out state when storage is unavailable.
  }
}

function normaliseStoredAccount(account) {
  const role = account?.role ?? USER_ROLE
  const isValid =
    account &&
    typeof account.id === 'string' &&
    typeof account.name === 'string' &&
    account.name.length >= 2 &&
    account.name.length <= 80 &&
    typeof account.email === 'string' &&
    account.email.length <= 120 &&
    typeof account.passwordHash === 'string' &&
    /^[a-f0-9]{64}$/.test(account.passwordHash) &&
    typeof account.passwordSalt === 'string' &&
    /^[a-f0-9]{32}$/.test(account.passwordSalt) &&
    typeof account.createdAt === 'string' &&
    VALID_ROLES.has(role)

  return isValid ? { ...account, role } : null
}

function readAccounts() {
  const storage = getStorage('local')
  if (!storage) return []

  try {
    const savedValue = storage.getItem(ACCOUNTS_KEY)
    if (!savedValue) return []

    const parsedValue = JSON.parse(savedValue)
    const normalisedAccounts =
      parsedValue?.version === STORAGE_VERSION && Array.isArray(parsedValue.accounts)
        ? parsedValue.accounts.map(normaliseStoredAccount)
        : []
    const isValid =
      parsedValue?.version === STORAGE_VERSION &&
      Array.isArray(parsedValue.accounts) &&
      normalisedAccounts.length === parsedValue.accounts.length &&
      normalisedAccounts.every(Boolean)

    if (!isValid) {
      safeRemove(storage, ACCOUNTS_KEY)
      return []
    }

    if (parsedValue.accounts.some((account) => !account.role)) {
      writeAccounts(normalisedAccounts)
    }

    return normalisedAccounts
  } catch {
    safeRemove(storage, ACCOUNTS_KEY)
    return []
  }
}

function writeAccounts(accounts) {
  const storage = getStorage('local')
  if (!storage) return false

  try {
    storage.setItem(ACCOUNTS_KEY, JSON.stringify({ version: STORAGE_VERSION, accounts }))
    return true
  } catch {
    return false
  }
}

function readSession(storage, key) {
  if (!storage) return null

  try {
    const savedValue = storage.getItem(key)
    if (!savedValue) return null

    const parsedValue = JSON.parse(savedValue)
    if (parsedValue?.version !== STORAGE_VERSION || typeof parsedValue.accountId !== 'string') {
      safeRemove(storage, key)
      return null
    }

    return parsedValue
  } catch {
    safeRemove(storage, key)
    return null
  }
}

function clearStoredSessions() {
  safeRemove(getStorage('local'), PERSISTENT_SESSION_KEY)
  safeRemove(getStorage('session'), TAB_SESSION_KEY)
}

function writeSession(accountId, rememberUser) {
  clearStoredSessions()

  const storage = getStorage(rememberUser ? 'local' : 'session')
  const key = rememberUser ? PERSISTENT_SESSION_KEY : TAB_SESSION_KEY
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, accountId }))
    return true
  } catch {
    return false
  }
}

function toPublicUser(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    createdAt: account.createdAt,
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')
}

function getCrypto() {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi?.subtle || !cryptoApi.getRandomValues) {
    throw new Error('Secure browser cryptography is unavailable.')
  }

  return cryptoApi
}

function createSalt() {
  const bytes = new Uint8Array(16)
  getCrypto().getRandomValues(bytes)
  return bytesToHex(bytes)
}

function createAccountId() {
  const cryptoApi = getCrypto()
  if (typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID()

  const bytes = new Uint8Array(16)
  cryptoApi.getRandomValues(bytes)
  return bytesToHex(bytes)
}

async function hashPassword(password, salt) {
  const passwordBytes = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await getCrypto().subtle.digest('SHA-256', passwordBytes)
  return bytesToHex(new Uint8Array(digest))
}

async function ensureDefaultUserAccount() {
  const accounts = readAccounts()
  const existingUser = accounts.find(
    (account) =>
      account.id === DEFAULT_USER_ID &&
      account.email === defaultUserCredentials.email &&
      account.role === USER_ROLE &&
      account.seedCredentialVersion === DEFAULT_USER_CREDENTIAL_VERSION,
  )

  if (existingUser) return true

  try {
    const passwordSalt = createSalt()
    const userAccount = {
      id: DEFAULT_USER_ID,
      name: 'SilverCare User',
      email: defaultUserCredentials.email,
      role: USER_ROLE,
      seedCredentialVersion: DEFAULT_USER_CREDENTIAL_VERSION,
      passwordHash: await hashPassword(defaultUserCredentials.password, passwordSalt),
      passwordSalt,
      createdAt: new Date().toISOString(),
    }
    const otherAccounts = accounts.filter(
      (account) => account.id !== DEFAULT_USER_ID && account.email !== defaultUserCredentials.email,
    )

    return writeAccounts([...otherAccounts, userAccount])
  } catch {
    return false
  }
}

async function ensureDefaultStaffAccount() {
  const accounts = readAccounts()
  const existingStaff = accounts.find(
    (account) =>
      account.id === DEFAULT_STAFF_ID &&
      account.email === defaultStaffCredentials.email &&
      account.role === STAFF_ROLE &&
      account.seedCredentialVersion === DEFAULT_STAFF_CREDENTIAL_VERSION,
  )

  if (existingStaff) return true

  try {
    const passwordSalt = createSalt()
    const staffAccount = {
      id: DEFAULT_STAFF_ID,
      name: 'SilverCare Staff',
      email: defaultStaffCredentials.email,
      role: STAFF_ROLE,
      seedCredentialVersion: DEFAULT_STAFF_CREDENTIAL_VERSION,
      passwordHash: await hashPassword(defaultStaffCredentials.password, passwordSalt),
      passwordSalt,
      createdAt: new Date().toISOString(),
    }
    const customerAccounts = accounts.filter(
      (account) =>
        account.id !== DEFAULT_STAFF_ID && account.email !== defaultStaffCredentials.email,
    )

    return writeAccounts([...customerAccounts, staffAccount])
  } catch {
    return false
  }
}

export async function initialiseAuth() {
  if (isInitialised.value) return

  await ensureDefaultUserAccount()
  await ensureDefaultStaffAccount()
  const accounts = readAccounts()
  const sessionSources = [
    { storage: getStorage('local'), key: PERSISTENT_SESSION_KEY },
    { storage: getStorage('session'), key: TAB_SESSION_KEY },
  ]

  for (const source of sessionSources) {
    const session = readSession(source.storage, source.key)
    if (!session) continue

    const account = accounts.find((candidate) => candidate.id === session.accountId)
    if (account) {
      currentUserState.value = toPublicUser(account)
      isInitialised.value = true
      return
    }

    safeRemove(source.storage, source.key)
  }

  currentUserState.value = null
  isInitialised.value = true
}

export async function registerAccount({ name, email, password }) {
  const accounts = readAccounts()
  const normalisedEmail = email.trim().toLowerCase()

  if (accounts.some((account) => account.email === normalisedEmail)) {
    return { ok: false, reason: 'email-exists' }
  }

  try {
    const passwordSalt = createSalt()
    const account = {
      id: createAccountId(),
      name: name.trim(),
      email: normalisedEmail,
      role: USER_ROLE,
      passwordHash: await hashPassword(password, passwordSalt),
      passwordSalt,
      createdAt: new Date().toISOString(),
    }

    if (!writeAccounts([...accounts, account])) {
      return { ok: false, reason: 'storage-unavailable' }
    }

    return { ok: true }
  } catch {
    return { ok: false, reason: 'storage-unavailable' }
  }
}

export async function login({ email, password, rememberUser }) {
  const normalisedEmail = email.trim().toLowerCase()
  const account = readAccounts().find((candidate) => candidate.email === normalisedEmail)

  if (!account) return { ok: false, reason: 'invalid-credentials' }

  try {
    const passwordHash = await hashPassword(password, account.passwordSalt)
    if (passwordHash !== account.passwordHash) {
      return { ok: false, reason: 'invalid-credentials' }
    }

    if (!writeSession(account.id, rememberUser)) {
      return { ok: false, reason: 'storage-unavailable' }
    }

    currentUserState.value = toPublicUser(account)
    return { ok: true }
  } catch {
    return { ok: false, reason: 'storage-unavailable' }
  }
}

export function logout() {
  clearStoredSessions()
  currentUserState.value = null
}
