<script setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div class="app-shell">
    <AppHeader />
    <main id="main-content" tabindex="-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
