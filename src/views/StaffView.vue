<script setup>
import { computed, ref } from 'vue'

import FeedbackTable from '@/components/FeedbackTable.vue'
import { discoveryItems, resourceItems, supportItems } from '@/data/discoveryItems'
import { currentUser, getPublicAccounts } from '@/stores/auth'
import { ratings } from '@/stores/ratings'

const VIEW_BY_TARGET = 'by-target'
const VIEW_ALL = 'all'
const viewMode = ref(VIEW_BY_TARGET)
const selectedTargetId = ref(discoveryItems[0]?.id ?? '')
const allFeedbackTarget = ref('all')
const selectedScore = ref('all')
const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const allFeedbackEntries = computed(() => {
  const accountsById = new Map(
    getPublicAccounts().map((account) => [account.id, account]),
  )
  const itemsById = new Map(discoveryItems.map((item) => [item.id, item]))

  return [...ratings.value]
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
    .map((rating) => {
      const account = accountsById.get(rating.userId)
      const item = itemsById.get(rating.itemId)

      return {
        ...rating,
        userEmail: account?.email ?? 'Email unavailable',
        itemTitle: item?.title ?? 'Unknown item',
        itemType: item?.type === 'support' ? 'Support service' : 'Health information',
        formattedDate: dateFormatter.format(new Date(rating.updatedAt)),
      }
    })
})

const selectedTarget = computed(
  () => discoveryItems.find((item) => item.id === selectedTargetId.value) ?? null,
)
const hasActiveFilters = computed(
  () =>
    selectedScore.value !== 'all' ||
    (viewMode.value === VIEW_ALL && allFeedbackTarget.value !== 'all'),
)
const visibleFeedback = computed(() =>
  allFeedbackEntries.value.filter((entry) => {
    const targetId =
      viewMode.value === VIEW_BY_TARGET ? selectedTargetId.value : allFeedbackTarget.value
    const matchesTarget = targetId === 'all' || entry.itemId === targetId
    const matchesScore =
      selectedScore.value === 'all' || entry.value === Number(selectedScore.value)

    return matchesTarget && matchesScore
  }),
)
const feedbackSummary = computed(() => {
  const count = visibleFeedback.value.length
  const total =
    viewMode.value === VIEW_BY_TARGET
      ? allFeedbackEntries.value.filter((entry) => entry.itemId === selectedTargetId.value).length
      : allFeedbackEntries.value.length
  const label = `${count} ${count === 1 ? 'submission' : 'submissions'}`

  return hasActiveFilters.value ? `${label} shown from ${total}` : label
})

function getTargetCount(itemId) {
  return allFeedbackEntries.value.filter((entry) => entry.itemId === itemId).length
}

function selectView(mode) {
  viewMode.value = mode
  selectedScore.value = 'all'
  if (mode === VIEW_ALL) allFeedbackTarget.value = 'all'
}

function clearFilters() {
  selectedScore.value = 'all'
  allFeedbackTarget.value = 'all'
}
</script>

<template>
  <section class="section section--white" aria-labelledby="staff-title">
    <div class="container staff-content">
      <header class="staff-header">
        <h1 id="staff-title">Staff area</h1>
        <p>Welcome, {{ currentUser?.name }}. Review ratings and suggestions from users.</p>
      </header>

      <div class="staff-feedback__heading">
        <h2>User feedback</h2>
        <p>Choose how you want to review submissions.</p>
      </div>

      <div class="feedback-view-switch" aria-label="Feedback view">
        <button
          type="button"
          :aria-pressed="viewMode === VIEW_BY_TARGET"
          :class="{ 'feedback-view-switch__button--active': viewMode === VIEW_BY_TARGET }"
          class="feedback-view-switch__button"
          @click="selectView(VIEW_BY_TARGET)"
        >
          Browse by target
        </button>
        <button
          type="button"
          :aria-pressed="viewMode === VIEW_ALL"
          :class="{ 'feedback-view-switch__button--active': viewMode === VIEW_ALL }"
          class="feedback-view-switch__button"
          @click="selectView(VIEW_ALL)"
        >
          View all feedback
        </button>
      </div>

      <div v-if="viewMode === VIEW_BY_TARGET" class="target-browser">
        <nav class="target-browser__navigation" aria-label="Feedback targets">
          <section aria-labelledby="health-targets-title">
            <h3 id="health-targets-title">Health information</h3>
            <button
              v-for="item in resourceItems"
              :key="item.id"
              type="button"
              :aria-current="selectedTargetId === item.id ? 'true' : undefined"
              :class="{ 'target-browser__button--active': selectedTargetId === item.id }"
              class="target-browser__button"
              @click="selectedTargetId = item.id"
            >
              <span>{{ item.title }}</span>
              <span>{{ getTargetCount(item.id) }}</span>
            </button>
          </section>
          <section aria-labelledby="support-targets-title">
            <h3 id="support-targets-title">Support services</h3>
            <button
              v-for="item in supportItems"
              :key="item.id"
              type="button"
              :aria-current="selectedTargetId === item.id ? 'true' : undefined"
              :class="{ 'target-browser__button--active': selectedTargetId === item.id }"
              class="target-browser__button"
              @click="selectedTargetId = item.id"
            >
              <span>{{ item.title }}</span>
              <span>{{ getTargetCount(item.id) }}</span>
            </button>
          </section>
        </nav>

        <div class="target-browser__mobile">
          <label for="mobile-feedback-target">Feedback target</label>
          <select id="mobile-feedback-target" v-model="selectedTargetId">
            <optgroup label="Health information">
              <option v-for="item in resourceItems" :key="item.id" :value="item.id">
                {{ item.title }}
              </option>
            </optgroup>
            <optgroup label="Support services">
              <option v-for="item in supportItems" :key="item.id" :value="item.id">
                {{ item.title }}
              </option>
            </optgroup>
          </select>
        </div>

        <div class="target-browser__results">
          <header>
            <p>{{ selectedTarget?.type === 'support' ? 'Support service' : 'Health information' }}</p>
            <h3>{{ selectedTarget?.title }}</h3>
          </header>

          <div class="staff-filter-panel staff-filter-panel--score">
            <div class="staff-filter-field">
              <label for="target-score-filter">Score</label>
              <select id="target-score-filter" v-model="selectedScore">
                <option value="all">All scores</option>
                <option v-for="score in [5, 4, 3, 2, 1]" :key="score" :value="String(score)">
                  {{ score }} out of 5
                </option>
              </select>
            </div>
            <button
              v-if="hasActiveFilters"
              class="button button--secondary"
              type="button"
              @click="clearFilters"
            >
              Clear filter
            </button>
          </div>

          <p class="staff-results-summary" role="status" aria-live="polite">
            {{ feedbackSummary }}
          </p>

          <FeedbackTable :entries="visibleFeedback" />
        </div>
      </div>

      <template v-else>
        <div class="staff-filter-panel">
          <div class="staff-filter-field">
            <label for="all-target-filter">Target</label>
            <select id="all-target-filter" v-model="allFeedbackTarget">
              <option value="all">All targets</option>
              <optgroup label="Health information">
                <option v-for="item in resourceItems" :key="item.id" :value="item.id">
                  {{ item.title }}
                </option>
              </optgroup>
              <optgroup label="Support services">
                <option v-for="item in supportItems" :key="item.id" :value="item.id">
                  {{ item.title }}
                </option>
              </optgroup>
            </select>
          </div>
          <div class="staff-filter-field">
            <label for="all-score-filter">Score</label>
            <select id="all-score-filter" v-model="selectedScore">
              <option value="all">All scores</option>
              <option v-for="score in [5, 4, 3, 2, 1]" :key="score" :value="String(score)">
                {{ score }} out of 5
              </option>
            </select>
          </div>
          <button
            v-if="hasActiveFilters"
            class="button button--secondary"
            type="button"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>

        <p class="staff-results-summary" role="status" aria-live="polite">
          {{ feedbackSummary }}
        </p>

        <FeedbackTable :entries="visibleFeedback" />
      </template>
    </div>
  </section>
</template>
