<script setup>
import { computed } from 'vue'

import { usePersistentFilters } from '@/composables/usePersistentFilters'
import { resourceItems } from '@/data/discoveryItems'

const categoryOptions = Array.from(
  new Map(resourceItems.map((item) => [item.category, item.categoryLabel])),
  ([value, label]) => ({ value, label }),
)

const { searchQuery, selectedCategory, hasActiveFilters, clearFilters } = usePersistentFilters(
  'silvercare:resource-filters',
  categoryOptions.map((option) => option.value),
)

const filteredResources = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return resourceItems.filter((resource) => {
    const matchesCategory =
      selectedCategory.value === 'all' || resource.category === selectedCategory.value
    const searchableText = [
      resource.title,
      resource.categoryLabel,
      resource.description,
      ...resource.keywords,
    ]
      .join(' ')
      .toLowerCase()

    return matchesCategory && (!query || searchableText.includes(query))
  })
})

const resultSummary = computed(() => {
  const count = filteredResources.value.length
  return `${count} health ${count === 1 ? 'topic' : 'topics'}`
})
</script>

<template>
  <section class="section section--white" aria-labelledby="resources-title">
    <div class="container discovery-page">
      <header class="discovery-page__header">
        <h1 id="resources-title">Health information</h1>
        <p>Search for a health topic or choose a category.</p>
      </header>

      <div class="filter-panel" role="search" aria-label="Filter health resources">
        <div class="filter-field filter-field--search">
          <label for="resource-search">Search by keyword</label>
          <input
            id="resource-search"
            v-model="searchQuery"
            type="search"
            maxlength="80"
            autocomplete="off"
            placeholder="e.g. medication or carers"
          />
        </div>
        <div class="filter-field">
          <label for="resource-category">Topic</label>
          <select id="resource-category" v-model="selectedCategory">
            <option value="all">All topics</option>
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <button
          v-if="hasActiveFilters"
          class="button button--secondary filter-panel__clear"
          type="button"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <p class="results-summary" role="status" aria-live="polite">{{ resultSummary }}</p>

      <div v-if="filteredResources.length" class="resource-grid">
        <article v-for="resource in filteredResources" :key="resource.id" class="resource-card">
          <p class="resource-card__category">{{ resource.categoryLabel }}</p>
          <h2>{{ resource.title }}</h2>
          <p>{{ resource.description }}</p>
        </article>
      </div>

      <div v-else class="discovery-empty" role="status">
        <h2>No health topics found</h2>
        <p>Try another word or select Clear filters.</p>
      </div>

      <aside class="information-note">
        <p>
          <strong>Important:</strong> This general information does not replace advice from a
          health professional. In an emergency, call 000.
        </p>
      </aside>
    </div>
  </section>
</template>
