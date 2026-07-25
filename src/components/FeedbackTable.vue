<script setup>
defineProps({
  entries: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div v-if="entries.length" class="feedback-table-wrap">
    <table class="feedback-table">
      <caption>User ratings and suggestions</caption>
      <thead>
        <tr>
          <th scope="col">Target</th>
          <th scope="col">Score</th>
          <th scope="col">Suggestion</th>
          <th scope="col">User email</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="`${entry.userId}:${entry.itemId}`">
          <td data-label="Target">
            <strong>{{ entry.itemTitle }}</strong>
            <span>{{ entry.itemType }}</span>
          </td>
          <td data-label="Score"><strong>{{ entry.value }} / 5</strong></td>
          <td data-label="Suggestion">
            {{ entry.suggestion || 'No suggestion provided.' }}
          </td>
          <td data-label="User email">{{ entry.userEmail }}</td>
          <td data-label="Time">{{ entry.formattedDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="staff-empty-state">
    <h3>No feedback found</h3>
    <p>There are no submissions matching the current selection.</p>
  </div>
</template>
