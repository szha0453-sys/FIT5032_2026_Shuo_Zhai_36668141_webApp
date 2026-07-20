<script setup>
import PageIntro from '@/components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="My SilverCare"
    title="My account"
    description="Keep saved information and useful support options together."
  />

  <section class="section section--white">
    <div class="container account-content">
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
