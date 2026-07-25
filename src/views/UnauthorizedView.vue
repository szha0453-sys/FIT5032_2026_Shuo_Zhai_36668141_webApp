<script setup>
import { computed } from 'vue'

import { currentUser, isStaff } from '@/stores/auth'

const accountDestination = computed(() => (isStaff.value ? '/staff' : '/account'))
const accountLabel = computed(() => (isStaff.value ? 'Go to staff area' : 'Go to my account'))
</script>

<template>
  <section class="status-page">
    <div class="container status-page__inner">
      <p class="status-code">403</p>
      <h1>You do not have access to that page</h1>
      <p>
        {{ currentUser?.name }}, this page is not available for your account type.
      </p>
      <div class="button-group button-group--center">
        <RouterLink class="button" :to="accountDestination">{{ accountLabel }}</RouterLink>
        <RouterLink class="button button--secondary" to="/">Return home</RouterLink>
      </div>
    </div>
  </section>
</template>
