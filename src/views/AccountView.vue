<script setup>
import RatingPanel from '@/components/RatingPanel.vue'
import { currentUser } from '@/stores/auth'
</script>

<template>
  <section class="section section--white" aria-labelledby="account-title">
    <div class="container account-content">
      <header class="account-header">
        <h1 id="account-title">Welcome, {{ currentUser?.name }}</h1>
        <p>{{ currentUser?.email }}</p>
      </header>

      <RatingPanel />
    </div>
  </section>
</template>
