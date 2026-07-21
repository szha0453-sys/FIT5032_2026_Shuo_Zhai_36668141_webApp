import { computed, ref, watch } from 'vue'

const STORAGE_VERSION = 1
const DEFAULT_CATEGORY = 'all'
const MAX_SEARCH_LENGTH = 80

function getStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function removeInvalidState(storage, storageKey) {
  try {
    storage?.removeItem(storageKey)
  } catch {
    // The filters still work in memory when browser storage is unavailable.
  }
}

function readFilterState(storageKey, allowedCategories) {
  const defaults = { searchQuery: '', selectedCategory: DEFAULT_CATEGORY }
  const storage = getStorage()

  if (!storage) return defaults

  try {
    const savedValue = storage.getItem(storageKey)
    if (!savedValue) return defaults

    const parsedValue = JSON.parse(savedValue)
    const isValidState =
      parsedValue?.version === STORAGE_VERSION &&
      typeof parsedValue.searchQuery === 'string' &&
      typeof parsedValue.selectedCategory === 'string' &&
      allowedCategories.has(parsedValue.selectedCategory)

    if (!isValidState) {
      removeInvalidState(storage, storageKey)
      return defaults
    }

    return {
      searchQuery: parsedValue.searchQuery.slice(0, MAX_SEARCH_LENGTH),
      selectedCategory: parsedValue.selectedCategory,
    }
  } catch {
    removeInvalidState(storage, storageKey)
    return defaults
  }
}

function writeFilterState(storageKey, searchQuery, selectedCategory) {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(
      storageKey,
      JSON.stringify({
        version: STORAGE_VERSION,
        searchQuery: searchQuery.slice(0, MAX_SEARCH_LENGTH),
        selectedCategory,
      }),
    )
  } catch {
    // Storage failures do not prevent visitors from filtering the current page.
  }
}

export function usePersistentFilters(storageKey, categories) {
  const allowedCategories = new Set([DEFAULT_CATEGORY, ...categories])
  const savedState = readFilterState(storageKey, allowedCategories)
  const searchQuery = ref(savedState.searchQuery)
  const selectedCategory = ref(savedState.selectedCategory)
  const hasActiveFilters = computed(
    () => Boolean(searchQuery.value.trim()) || selectedCategory.value !== DEFAULT_CATEGORY,
  )

  watch([searchQuery, selectedCategory], ([newSearchQuery, newCategory]) => {
    const safeCategory = allowedCategories.has(newCategory) ? newCategory : DEFAULT_CATEGORY
    writeFilterState(storageKey, newSearchQuery, safeCategory)
  })

  function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = DEFAULT_CATEGORY
  }

  return {
    searchQuery,
    selectedCategory,
    hasActiveFilters,
    clearFilters,
  }
}
