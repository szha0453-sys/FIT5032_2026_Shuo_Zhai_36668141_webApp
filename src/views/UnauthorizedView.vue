<script setup>
import { currentUser } from '@/stores/auth'
</script>

<template>
  <section class="status-page">
    <div class="container status-page__inner">
      <p class="status-code">403</p>
      <h1>You do not have access to that page</h1>
      <p>
        {{ currentUser?.name }}, your {{ currentUser?.role }} account does not have the required
        staff permission.
      </p>
      <div class="button-group button-group--center">
        <RouterLink class="button" to="/account">Go to my account</RouterLink>
        <RouterLink class="button button--secondary" to="/">Return home</RouterLink>
      </div>
    </div>
  </section>
</template>
