<script setup>
import { computed } from 'vue'

import PageIntro from '@/components/PageIntro.vue'
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
  return `${count} support ${count === 1 ? 'pathway' : 'pathways'} found`
})
</script>

<template>
  <PageIntro
    eyebrow="Local services"
    title="Find the right type of support"
    description="Explore common service pathways for health, caring, mobility and community connection."
  />

  <section class="section section--white" aria-labelledby="support-types-title">
    <div class="container">
      <div class="section-heading section-heading--compact discovery-heading">
        <div>
          <p class="eyebrow">Support pathways</p>
          <h2 id="support-types-title">Search support pathways</h2>
        </div>
        <p>Search by a word or choose a service type, or call our team if you are unsure.</p>
      </div>

      <div class="filter-panel" role="search" aria-label="Filter support pathways">
        <div class="filter-field filter-field--search">
          <label for="support-search">Search support</label>
          <input
            id="support-search"
            v-model="searchQuery"
            type="search"
            maxlength="80"
            autocomplete="off"
            placeholder="Try transport, meals or nursing"
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
          <span aria-hidden="true">{{ service.icon }}</span>
          <div>
            <p class="support-option__category">{{ service.categoryLabel }}</p>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </article>
      </div>

      <div v-else class="discovery-empty" role="status">
        <span class="discovery-empty__icon" aria-hidden="true">?</span>
        <h3>No support pathways match your search</h3>
        <p>Try a different word or service type, or clear the filters to see every pathway.</p>
        <button class="button button--secondary" type="button" @click="clearFilters">
          Show all support
        </button>
      </div>

      <aside class="support-help-card" aria-labelledby="support-help-title">
        <div>
          <p class="eyebrow">Not sure where to start?</p>
          <h2 id="support-help-title">Talk to our support team</h2>
          <p>We can help you identify the right type of service and explain the next step.</p>
        </div>
        <div class="support-help-card__contact">
          <a class="button" href="tel:1800555019">Call 1800 555 019</a>
          <span>Monday to Friday, 9 am–5 pm</span>
        </div>
      </aside>
    </div>
  </section>
</template>
