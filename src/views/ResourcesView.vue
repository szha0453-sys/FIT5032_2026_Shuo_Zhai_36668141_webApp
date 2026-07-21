<script setup>
import { computed } from 'vue'

import PageIntro from '@/components/PageIntro.vue'
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
  return `${count} ${count === 1 ? 'resource' : 'resources'} found`
})
</script>

<template>
  <PageIntro
    eyebrow="Health library"
    title="Information you can understand and use"
    description="Explore practical guidance for healthy ageing, caring and everyday wellbeing."
  />

  <section class="section section--white" aria-labelledby="resource-categories-title">
    <div class="container">
      <div class="section-heading section-heading--compact discovery-heading">
        <div>
          <p class="eyebrow">Browse by topic</p>
          <h2 id="resource-categories-title">Search the health library</h2>
        </div>
        <p>Search by a word or choose the topic that best matches what you need today.</p>
      </div>

      <div class="filter-panel" role="search" aria-label="Filter health resources">
        <div class="filter-field filter-field--search">
          <label for="resource-search">Search resources</label>
          <input
            id="resource-search"
            v-model="searchQuery"
            type="search"
            maxlength="80"
            autocomplete="off"
            placeholder="Try medication, exercise or carers"
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

      <div v-if="filteredResources.length" class="card-grid card-grid--three">
        <article v-for="resource in filteredResources" :key="resource.id" class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">{{ resource.icon }}</span>
          <p class="resource-card__category">{{ resource.categoryLabel }}</p>
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.description }}</p>
        </article>
      </div>

      <div v-else class="discovery-empty" role="status">
        <span class="discovery-empty__icon" aria-hidden="true">?</span>
        <h3>No resources match your search</h3>
        <p>Try a different word or topic, or clear the filters to see every resource.</p>
        <button class="button button--secondary" type="button" @click="clearFilters">
          Show all resources
        </button>
      </div>

      <aside class="information-note" aria-labelledby="resource-note-title">
        <span class="information-note__icon" aria-hidden="true">i</span>
        <div>
          <h2 id="resource-note-title">Health information notice</h2>
          <p>
            SilverCare provides general information and does not replace advice from your doctor
            or another qualified health professional. In an emergency, call 000.
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>
