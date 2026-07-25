<script setup>
import { currentUser } from '@/stores/auth'
</script>

<template>
  <section class="section section--white" aria-labelledby="staff-title">
    <div class="container staff-content">
      <header class="staff-header">
        <h1 id="staff-title">Staff area</h1>
        <p>Welcome, {{ currentUser?.name }}. Choose an area to review.</p>
      </header>

      <div class="management-grid">
        <RouterLink class="management-link" to="/resources">
          <h2>Health resources <span aria-hidden="true">→</span></h2>
        </RouterLink>
        <RouterLink class="management-link" to="/find-support">
          <h2>Support information <span aria-hidden="true">→</span></h2>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
