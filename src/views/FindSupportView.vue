<script setup>
import { computed } from 'vue'

import { usePersistentFilters } from '@/composables/usePersistentFilters'
import { supportItems } from '@/data/discoveryItems'

const categoryOptions = Array.from(
  new Map(supportItems.map((item) => [item.category, item.categoryLabel])),
  ([value, label]) => ({ value, label }),
)

const { searchQuery, selectedCategory, hasActiveFilters, clearFilters } = usePersistentFilters(
  'silvercare:support-filters',
  categoryOptions.map((option) => option.value),
)

const filteredSupport = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return supportItems.filter((service) => {
    const matchesCategory =
      selectedCategory.value === 'all' || service.category === selectedCategory.value
    const searchableText = [
      service.title,
      service.categoryLabel,
      service.description,
      ...service.keywords,
    ]
      .join(' ')
      .toLowerCase()

    return matchesCategory && (!query || searchableText.includes(query))
  })
})

const resultSummary = computed(() => {
  const count = filteredSupport.value.length
  return `${count} support ${count === 1 ? 'option' : 'options'}`
})
</script>

<template>
  <section class="section section--white" aria-labelledby="support-title">
    <div class="container discovery-page">
      <header class="discovery-page__header">
        <h1 id="support-title">Find support services</h1>
        <p>Search for the type of help you need or choose a service category.</p>
      </header>

      <div class="filter-panel" role="search" aria-label="Search support services">
        <div class="filter-field filter-field--search">
          <label for="support-search">Search by keyword</label>
          <input
            id="support-search"
            v-model="searchQuery"
            type="search"
            maxlength="80"
            autocomplete="off"
            placeholder="e.g. transport or meals"
          />
        </div>
        <div class="filter-field">
          <label for="support-category">Service type</label>
          <select id="support-category" v-model="selectedCategory">
            <option value="all">All service types</option>
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

      <div v-if="filteredSupport.length" class="support-options">
        <article v-for="service in filteredSupport" :key="service.id" class="support-option">
          <p class="support-option__category">{{ service.categoryLabel }}</p>
          <h2>{{ service.title }}</h2>
          <p>{{ service.description }}</p>
        </article>
      </div>

      <div v-else class="discovery-empty" role="status">
        <h2>No support options found</h2>
        <p>Try another word or select Clear filters.</p>
      </div>

      <aside class="support-help-card" aria-labelledby="support-help-title">
        <div>
          <h2 id="support-help-title">Not sure which service you need?</h2>
          <p>Call us and we will help you choose a next step.</p>
        </div>
        <div class="support-help-card__contact">
          <a class="button" href="tel:1800555019">Call 1800 555 019</a>
          <span>Monday–Friday, 9 am–5 pm</span>
        </div>
      </aside>
    </div>
  </section>
</template>
