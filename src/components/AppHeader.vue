<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { isAuthenticated, isStaff, logout } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Resources', to: '/resources' },
  { label: 'Find support', to: '/find-support' },
]

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)

async function handleLogout() {
  logout()
  await router.push({ name: 'home' })
}
</script>

<template>
  <header class="site-header">
    <div class="support-bar">
      <div class="container support-bar__inner">
        <a href="tel:1800555019">Need help? Call 1800 555 019</a>
      </div>
    </div>

    <div class="container header-main">
      <RouterLink class="brand" to="/" aria-label="SilverCare home">
        <svg class="brand__mark" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 41S7 31.2 7 18.2C7 10.5 16.6 7 24 14.5 31.4 7 41 10.5 41 18.2 41 31.2 24 41 24 41Z" />
          <path class="brand__spark" d="M24 16v16M16 24h16" />
        </svg>
        <span>Silver<span>Care</span></span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="primary-navigation"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="menu-toggle__icon" aria-hidden="true"></span>
        <span>{{ isMenuOpen ? 'Close' : 'Menu' }}</span>
      </button>

      <nav
        id="primary-navigation"
        class="primary-navigation"
        :class="{ 'primary-navigation--open': isMenuOpen }"
        aria-label="Primary navigation"
      >
        <ul class="primary-navigation__links">
          <li v-for="item in navigation" :key="item.to">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </li>
        </ul>
        <div v-if="isAuthenticated" class="account-actions">
          <RouterLink v-if="isStaff" class="text-link" to="/staff">Staff area</RouterLink>
          <RouterLink class="text-link" to="/account">My account</RouterLink>
          <button class="button button--secondary button--small" type="button" @click="handleLogout">
            Log out
          </button>
        </div>
        <div v-else class="account-actions">
          <RouterLink class="text-link" to="/login">Log in</RouterLink>
          <RouterLink class="button button--small" to="/register">Create account</RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>
