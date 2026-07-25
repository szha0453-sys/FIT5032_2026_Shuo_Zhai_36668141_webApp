import { readonly, ref } from 'vue'

import { discoveryItems } from '@/data/discoveryItems'

const STORAGE_VERSION = 1
const RATINGS_KEY = 'silvercare:ratings'
const MIN_RATING = 1
const MAX_RATING = 5
const MAX_USER_ID_LENGTH = 128
export const MAX_SUGGESTION_LENGTH = 500
const VALID_ITEM_IDS = new Set(discoveryItems.map((item) => item.id))
const USER_ID_PATTERN = /^[a-zA-Z0-9-]+$/

const ratingsState = ref([])
let isInitialised = false

export const ratings = readonly(ratingsState)

function getStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function safeRemove(storage) {
  try {
    storage?.removeItem(RATINGS_KEY)
  } catch {
    // The rating page safely falls back to an empty state.
  }
}

function isValidUserId(userId) {
  return (
    typeof userId === 'string' &&
    userId.length >= 1 &&
    userId.length <= MAX_USER_ID_LENGTH &&
    USER_ID_PATTERN.test(userId)
  )
}

function isValidRatingValue(value) {
  return Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING
}

function normaliseStoredRating(record) {
  const suggestion = record?.suggestion ?? ''
  const isValid =
    record &&
    isValidUserId(record.userId) &&
    typeof record.itemId === 'string' &&
    VALID_ITEM_IDS.has(record.itemId) &&
    isValidRatingValue(record.value) &&
    typeof suggestion === 'string' &&
    suggestion.length <= MAX_SUGGESTION_LENGTH &&
    typeof record.updatedAt === 'string' &&
    record.updatedAt.length <= 40 &&
    Number.isFinite(Date.parse(record.updatedAt))

  if (!isValid) return null

  return {
    userId: record.userId,
    itemId: record.itemId,
    value: record.value,
    suggestion,
    updatedAt: record.updatedAt,
  }
}

function readRatings() {
  const storage = getStorage()
  if (!storage) return []

  try {
    const savedValue = storage.getItem(RATINGS_KEY)
    if (!savedValue) return []

    const parsedValue = JSON.parse(savedValue)
    if (parsedValue?.version !== STORAGE_VERSION || !Array.isArray(parsedValue.ratings)) {
      safeRemove(storage)
      return []
    }

    const normalisedRatings = parsedValue.ratings.map(normaliseStoredRating)
    const uniqueKeys = new Set(
      normalisedRatings
        .filter(Boolean)
        .map((rating) => `${rating.userId}:${rating.itemId}`),
    )
    const isValid =
      normalisedRatings.every(Boolean) && uniqueKeys.size === normalisedRatings.length

    if (!isValid) {
      safeRemove(storage)
      return []
    }

    return normalisedRatings
  } catch {
    safeRemove(storage)
    return []
  }
}

function writeRatings(nextRatings) {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.setItem(
      RATINGS_KEY,
      JSON.stringify({ version: STORAGE_VERSION, ratings: nextRatings }),
    )
    return true
  } catch {
    return false
  }
}

export function initialiseRatings() {
  if (isInitialised) return

  ratingsState.value = readRatings()
  isInitialised = true
}

export function getUserRating(userId, itemId) {
  if (!isValidUserId(userId) || !VALID_ITEM_IDS.has(itemId)) return null

  return (
    ratingsState.value.find(
      (rating) => rating.userId === userId && rating.itemId === itemId,
    )?.value ?? null
  )
}

export function getUserSuggestion(userId, itemId) {
  if (!isValidUserId(userId) || !VALID_ITEM_IDS.has(itemId)) return ''

  return (
    ratingsState.value.find(
      (rating) => rating.userId === userId && rating.itemId === itemId,
    )?.suggestion ?? ''
  )
}

export function getRatingSummary(itemId) {
  if (!VALID_ITEM_IDS.has(itemId)) return { average: null, count: 0 }

  const itemRatings = ratingsState.value.filter((rating) => rating.itemId === itemId)
  if (!itemRatings.length) return { average: null, count: 0 }

  const total = itemRatings.reduce((sum, rating) => sum + rating.value, 0)
  return {
    average: total / itemRatings.length,
    count: itemRatings.length,
  }
}

export function saveRating({ userId, itemId, value, suggestion = '' }) {
  if (
    !isValidUserId(userId) ||
    !VALID_ITEM_IDS.has(itemId) ||
    !isValidRatingValue(value) ||
    typeof suggestion !== 'string' ||
    suggestion.length > MAX_SUGGESTION_LENGTH
  ) {
    return { ok: false, reason: 'invalid-rating' }
  }

  const nextRating = {
    userId,
    itemId,
    value,
    suggestion: suggestion.trim(),
    updatedAt: new Date().toISOString(),
  }
  const existingIndex = ratingsState.value.findIndex(
    (rating) => rating.userId === userId && rating.itemId === itemId,
  )
  const nextRatings = [...ratingsState.value]

  if (existingIndex >= 0) nextRatings.splice(existingIndex, 1, nextRating)
  else nextRatings.push(nextRating)

  if (!writeRatings(nextRatings)) return { ok: false, reason: 'storage-unavailable' }

  ratingsState.value = nextRatings
  return { ok: true, updated: existingIndex >= 0 }
}
