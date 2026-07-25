<script setup>
import { currentUser } from '@/stores/auth'
</script>

<template>
  <section class="section section--white" aria-labelledby="account-title">
    <div class="container account-content">
      <header class="account-header">
        <h1 id="account-title">Welcome, {{ currentUser?.name }}</h1>
        <p>{{ currentUser?.email }}</p>
      </header>

      <h2>Saved resources</h2>

      <div class="empty-state">
        <h3>No saved resources yet</h3>
        <p>Browse health information and save useful resources here for later.</p>
        <RouterLink class="button button--secondary" to="/resources">Browse resources</RouterLink>
      </div>
    </div>
  </section>
</template>
