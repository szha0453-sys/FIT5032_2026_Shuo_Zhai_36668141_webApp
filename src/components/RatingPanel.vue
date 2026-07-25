<script setup>
import { computed, nextTick, ref, watch } from 'vue'

import { discoveryItems, resourceItems, supportItems } from '@/data/discoveryItems'
import { currentUser } from '@/stores/auth'
import {
  getRatingSummary,
  getUserRating,
  getUserSuggestion,
  MAX_SUGGESTION_LENGTH,
  saveRating,
} from '@/stores/ratings'

const ratingChoices = [
  { value: 1, label: 'Not helpful' },
  { value: 2, label: 'Slightly helpful' },
  { value: 3, label: 'Helpful' },
  { value: 4, label: 'Very helpful' },
  { value: 5, label: 'Extremely helpful' },
]
const selectedItemId = ref(discoveryItems[0]?.id ?? '')
const selectedRating = ref(null)
const suggestion = ref('')
const ratingError = ref('')
const saveStatus = ref('')
const ratingInputs = ref([])

const selectedItem = computed(
  () => discoveryItems.find((item) => item.id === selectedItemId.value) ?? null,
)
const userRating = computed(() => getUserRating(currentUser.value?.id, selectedItemId.value))
const ratingSummary = computed(() => getRatingSummary(selectedItemId.value))
const hasExistingRating = computed(() => userRating.value !== null)
const submitLabel = computed(() =>
  hasExistingRating.value ? 'Update my rating' : 'Save my rating',
)
const aggregateLabel = computed(() => {
  const { average, count } = ratingSummary.value
  if (!count) return 'No ratings yet'

  return `${average.toFixed(1)} out of 5 from ${count} ${count === 1 ? 'person' : 'people'}`
})

watch(
  selectedItemId,
  () => {
    selectedRating.value = userRating.value
    suggestion.value = getUserSuggestion(currentUser.value?.id, selectedItemId.value)
    ratingError.value = ''
    saveStatus.value = ''
  },
  { immediate: true },
)

function handleRatingChange() {
  ratingError.value = ''
  saveStatus.value = ''
}

function handleSuggestionInput() {
  ratingError.value = ''
  saveStatus.value = ''
}

async function handleSubmit() {
  ratingError.value = ''
  saveStatus.value = ''

  if (!Number.isInteger(selectedRating.value)) {
    ratingError.value = 'Choose a rating from 1 to 5.'
    await nextTick()
    ratingInputs.value[0]?.focus()
    return
  }

  const result = saveRating({
    userId: currentUser.value?.id,
    itemId: selectedItemId.value,
    value: selectedRating.value,
    suggestion: suggestion.value,
  })

  if (!result.ok) {
    ratingError.value =
      result.reason === 'invalid-rating'
        ? 'Choose a valid item and a rating from 1 to 5.'
        : 'Your rating could not be saved. Please try again.'
    return
  }

  saveStatus.value = result.updated ? 'Your rating has been updated.' : 'Your rating has been saved.'
}
</script>

<template>
  <section class="rating-section" aria-labelledby="rating-title">
    <header class="rating-section__header">
      <h2 id="rating-title">Rate information and services</h2>
      <p>Choose an item and tell us how helpful it was.</p>
    </header>

    <form class="rating-card" novalidate @submit.prevent="handleSubmit">
      <div class="rating-field">
        <label for="rating-item">Information or service</label>
        <select id="rating-item" v-model="selectedItemId">
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

      <div class="rating-summary" aria-live="polite">
        <h3>{{ selectedItem?.title }}</h3>
        <p class="rating-summary__aggregate">{{ aggregateLabel }}</p>
        <p v-if="hasExistingRating">Your rating: {{ userRating }} out of 5</p>
        <p v-else>You have not rated this item.</p>
      </div>

      <fieldset
        class="rating-options"
        :aria-invalid="ratingError ? 'true' : 'false'"
        :aria-describedby="ratingError ? 'rating-help rating-error' : 'rating-help'"
      >
        <legend>How helpful was this?</legend>
        <p id="rating-help">Select one rating. You can change it later.</p>
        <div class="rating-options__grid">
          <label
            v-for="choice in ratingChoices"
            :key="choice.value"
            :class="{ 'rating-choice--selected': selectedRating === choice.value }"
            class="rating-choice"
          >
            <input
              ref="ratingInputs"
              v-model="selectedRating"
              type="radio"
              name="rating"
              :value="choice.value"
              @change="handleRatingChange"
            />
            <span class="rating-choice__score">{{ choice.value }}</span>
            <span>{{ choice.label }}</span>
          </label>
        </div>
      </fieldset>

      <div class="rating-field rating-field--suggestion">
        <label for="rating-suggestion">Suggestion (optional)</label>
        <textarea
          id="rating-suggestion"
          v-model="suggestion"
          rows="4"
          :maxlength="MAX_SUGGESTION_LENGTH"
          placeholder="Tell us what could be improved"
          @input="handleSuggestionInput"
        ></textarea>
        <p>Maximum {{ MAX_SUGGESTION_LENGTH }} characters.</p>
      </div>

      <p v-if="ratingError" id="rating-error" class="field-error" role="alert">
        {{ ratingError }}
      </p>
      <p v-if="saveStatus" class="form-status form-status--success" role="status">
        {{ saveStatus }}
      </p>

      <button class="button" type="submit">{{ submitLabel }}</button>
    </form>
  </section>
</template>
