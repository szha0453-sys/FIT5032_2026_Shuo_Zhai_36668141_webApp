<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { currentUser, login } from '@/stores/auth'
import { getSafeRedirect } from '@/utils/navigation'

const route = useRoute()
const router = useRouter()
const form = reactive({ email: '', password: '', rememberUser: false })
const errors = reactive({ email: '', password: '' })
const emailInput = ref(null)
const passwordInput = ref(null)
const authError = ref('')
const isSubmitting = ref(false)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const registeredMessage = computed(() => route.query.registered === '1')
const registerRoute = computed(() => {
  if (typeof route.query.redirect !== 'string') return { name: 'register' }

  return {
    name: 'register',
    query: { redirect: getSafeRedirect(route.query.redirect) },
  }
})

function validateForm() {
  errors.email = !form.email.trim()
    ? 'Enter your email address.'
    : form.email.trim().length > 120
      ? 'Email address must be 120 characters or fewer.'
    : !emailPattern.test(form.email.trim())
      ? 'Enter a valid email address.'
      : ''
  errors.password = !form.password
    ? 'Enter your password.'
    : form.password.length > 64
      ? 'Password must be 64 characters or fewer.'
      : ''
}

function handleInput(field) {
  authError.value = ''

  if (field === 'email' && errors.email) {
    errors.email = !form.email.trim()
      ? 'Enter your email address.'
      : form.email.trim().length > 120
        ? 'Email address must be 120 characters or fewer.'
      : !emailPattern.test(form.email.trim())
        ? 'Enter a valid email address.'
        : ''
  }

  if (field === 'password' && errors.password) {
    errors.password = !form.password
      ? 'Enter your password.'
      : form.password.length > 64
        ? 'Password must be 64 characters or fewer.'
        : ''
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return

  authError.value = ''
  validateForm()

  if (errors.email || errors.password) {
    await nextTick()
    if (errors.email) emailInput.value?.focus()
    else passwordInput.value?.focus()
    return
  }

  isSubmitting.value = true
  const result = await login({
    email: form.email,
    password: form.password,
    rememberUser: form.rememberUser,
  })

  if (!result.ok) {
    isSubmitting.value = false
    authError.value =
      result.reason === 'invalid-credentials'
        ? 'Email or password is incorrect. Check your details and try again.'
        : 'We could not sign you in. Please try again.'
    await nextTick()
    emailInput.value?.focus()
    return
  }

  const defaultDestination = currentUser.value?.role === 'staff' ? '/staff' : '/account'
  await router.replace(getSafeRedirect(route.query.redirect, defaultDestination))
  isSubmitting.value = false
}
</script>

<template>
  <section class="section section--white auth-page" aria-labelledby="login-page-title">
    <div class="container auth-layout">
      <form class="auth-card" novalidate @submit.prevent="handleSubmit">
        <h1 id="login-page-title">Log in</h1>
        <p class="auth-lead">Access your saved resources and support information.</p>
        <p v-if="registeredMessage" class="form-status form-status--success" role="status">
          Account created successfully. Log in with your new details.
        </p>
        <p v-if="authError" class="form-status form-status--error" role="alert">
          {{ authError }}
        </p>
        <div class="field-group">
          <label for="login-email">Email address</label>
          <input
            id="login-email"
            ref="emailInput"
            v-model="form.email"
            name="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            maxlength="120"
            required
            :aria-invalid="errors.email ? 'true' : 'false'"
            :aria-describedby="errors.email ? 'login-email-error' : undefined"
            @input="handleInput('email')"
          />
          <p v-if="errors.email" id="login-email-error" class="field-error">
            {{ errors.email }}
          </p>
        </div>
        <div class="field-group">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            ref="passwordInput"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            maxlength="64"
            required
            :aria-invalid="errors.password ? 'true' : 'false'"
            :aria-describedby="errors.password ? 'login-password-error' : undefined"
            @input="handleInput('password')"
          />
          <p v-if="errors.password" id="login-password-error" class="field-error">
            {{ errors.password }}
          </p>
        </div>
        <label class="checkbox-field">
          <input v-model="form.rememberUser" type="checkbox" name="remember" />
          <span>Remember me on this device</span>
        </label>
        <button class="button button--full" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Logging in…' : 'Log in' }}
        </button>
        <p class="auth-switch">
          New to SilverCare? <RouterLink :to="registerRoute">Create an account</RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>
