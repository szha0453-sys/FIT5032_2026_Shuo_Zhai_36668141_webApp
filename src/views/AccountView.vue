<script setup>
import PageIntro from '@/components/PageIntro.vue'
import { currentUser } from '@/stores/auth'
</script>

<template>
  <PageIntro
    eyebrow="My SilverCare"
    title="My account"
    :description="`Signed in as ${currentUser?.email}. Keep useful support options together.`"
  />

  <section class="section section--white" aria-labelledby="account-overview-title">
    <div class="container account-content">
      <div class="account-profile">
        <div>
          <p class="eyebrow">Signed in</p>
          <h2 id="account-overview-title">Welcome, {{ currentUser?.name }}</h2>
          <p>{{ currentUser?.email }}</p>
          <p class="role-badge">
            {{ currentUser?.role === 'staff' ? 'Staff account' : 'Customer account' }}
          </p>
        </div>
      </div>

      <div class="section-heading section-heading--compact">
        <div>
          <p class="eyebrow">Your library</p>
          <h2>Saved resources</h2>
        </div>
        <RouterLink class="button button--secondary button--small" to="/resources">
          Browse resources
        </RouterLink>
      </div>

      <div class="empty-state">
        <span class="empty-state__icon" aria-hidden="true">♡</span>
        <h3>No saved resources yet</h3>
        <p>Saved resources and support options will appear here for easy access.</p>
        <RouterLink class="text-link" to="/resources">Explore health resources</RouterLink>
      </div>
    </div>
  </section>
</template>
