<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PageIntro from '@/components/PageIntro.vue'
import { registerAccount } from '@/stores/auth'
import { getSafeRedirect } from '@/utils/navigation'

const route = useRoute()
const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
  terms: false,
})

const nameInput = ref(null)
const emailInput = ref(null)
const passwordInput = ref(null)
const confirmPasswordInput = ref(null)
const termsInput = ref(null)
const submissionError = ref('')
const isSubmitting = ref(false)

const fieldOrder = ['name', 'email', 'password', 'confirmPassword', 'terms']
const fieldElements = {
  name: nameInput,
  email: emailInput,
  password: passwordInput,
  confirmPassword: confirmPasswordInput,
  terms: termsInput,
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const loginRoute = computed(() => {
  if (typeof route.query.redirect !== 'string') return { name: 'login' }

  return {
    name: 'login',
    query: { redirect: getSafeRedirect(route.query.redirect) },
  }
})

function getFieldError(field) {
  if (field === 'name') {
    if (!form.name.trim()) return 'Enter your full name.'
    if (form.name.trim().length < 2) return 'Full name must be at least 2 characters.'
  }

  if (field === 'email') {
    if (!form.email.trim()) return 'Enter your email address.'
    if (!emailPattern.test(form.email.trim())) {
      return 'Enter an email address in the format name@example.com.'
    }
  }

  if (field === 'password') {
    if (!form.password) return 'Enter a password.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
  }

  if (field === 'confirmPassword') {
    if (!form.confirmPassword) return 'Enter your password again.'
    if (form.confirmPassword !== form.password) return 'Passwords must match.'
  }

  if (field === 'terms' && !form.terms) {
    return 'Agree to the terms and privacy notice to continue.'
  }

  return ''
}

function validateField(field) {
  errors[field] = getFieldError(field)
}

function handleBlur(field) {
  touched[field] = true
  validateField(field)
}

function handleInput(field) {
  submissionError.value = ''

  if (touched[field] || errors[field]) {
    validateField(field)
  }

  if (field === 'password' && touched.confirmPassword) {
    validateField('confirmPassword')
  }
}

function handleTermsChange() {
  touched.terms = true
  submissionError.value = ''
  validateField('terms')
}

async function handleSubmit() {
  if (isSubmitting.value) return

  submissionError.value = ''
  fieldOrder.forEach((field) => {
    touched[field] = true
    validateField(field)
  })

  const firstInvalidField = fieldOrder.find((field) => errors[field])

  if (firstInvalidField) {
    await nextTick()
    fieldElements[firstInvalidField].value?.focus()
    return
  }

  isSubmitting.value = true
  const result = await registerAccount({
    name: form.name,
    email: form.email,
    password: form.password,
  })

  if (!result.ok) {
    isSubmitting.value = false

    if (result.reason === 'email-exists') {
      errors.email = 'An account with this email address already exists.'
      await nextTick()
      emailInput.value?.focus()
      return
    }

    submissionError.value =
      'We could not create your account in this browser. Check storage access and try again.'
    return
  }

  const redirect = getSafeRedirect(route.query.redirect)
  const query = { registered: '1' }
  if (typeof route.query.redirect === 'string') query.redirect = redirect

  await router.replace({ name: 'login', query })
  isSubmitting.value = false
}
</script>

<template>
  <PageIntro
    eyebrow="Join SilverCare"
    title="Create your account"
    description="Use the account form to organise information and support options that matter to you."
  />

  <section class="section section--white" aria-labelledby="register-form-title">
    <div class="container auth-layout">
      <form class="auth-card" novalidate @submit.prevent="handleSubmit">
        <h2 id="register-form-title">Your details</h2>
        <p v-if="submissionError" class="form-status form-status--error" role="alert">
          {{ submissionError }}
        </p>
        <div class="field-group">
          <label for="register-name">Full name</label>
          <input
            id="register-name"
            ref="nameInput"
            v-model="form.name"
            name="name"
            type="text"
            autocomplete="name"
            maxlength="80"
            required
            :aria-invalid="errors.name ? 'true' : 'false'"
            :aria-describedby="errors.name ? 'name-error' : undefined"
            @blur="handleBlur('name')"
            @input="handleInput('name')"
          />
          <p v-if="errors.name" id="name-error" class="field-error">
            {{ errors.name }}
          </p>
        </div>
        <div class="field-group">
          <label for="register-email">Email address</label>
          <input
            id="register-email"
            ref="emailInput"
            v-model="form.email"
            name="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            maxlength="120"
            required
            :aria-invalid="errors.email ? 'true' : 'false'"
            :aria-describedby="errors.email ? 'email-error' : undefined"
            @blur="handleBlur('email')"
            @input="handleInput('email')"
          />
          <p v-if="errors.email" id="email-error" class="field-error">
            {{ errors.email }}
          </p>
        </div>
        <div class="field-group">
          <label for="register-password">Password</label>
          <input
            id="register-password"
            ref="passwordInput"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            minlength="8"
            maxlength="64"
            required
            :aria-invalid="errors.password ? 'true' : 'false'"
            :aria-describedby="errors.password ? 'password-help password-error' : 'password-help'"
            @blur="handleBlur('password')"
            @input="handleInput('password')"
          />
          <p id="password-help" class="field-help">
            Use at least 8 characters and choose a password you do not use elsewhere.
          </p>
          <p v-if="errors.password" id="password-error" class="field-error">
            {{ errors.password }}
          </p>
        </div>
        <div class="field-group">
          <label for="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            ref="confirmPasswordInput"
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            maxlength="64"
            required
            :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
            :aria-describedby="errors.confirmPassword ? 'confirm-password-error' : undefined"
            @blur="handleBlur('confirmPassword')"
            @input="handleInput('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" id="confirm-password-error" class="field-error">
            {{ errors.confirmPassword }}
          </p>
        </div>
        <div class="field-group field-group--checkbox">
          <label class="checkbox-field">
            <input
              ref="termsInput"
              v-model="form.terms"
              type="checkbox"
              name="terms"
              required
              :aria-invalid="errors.terms ? 'true' : 'false'"
              :aria-describedby="errors.terms ? 'terms-error' : undefined"
              @change="handleTermsChange"
            />
            <span>I agree to the terms and privacy notice.</span>
          </label>
          <p v-if="errors.terms" id="terms-error" class="field-error">
            {{ errors.terms }}
          </p>
        </div>
        <button class="button button--full" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account…' : 'Create account' }}
        </button>
        <p class="auth-switch">
          Already have an account? <RouterLink :to="loginRoute">Log in</RouterLink>
        </p>
      </form>

      <aside class="auth-benefits" aria-labelledby="register-benefits-title">
        <p class="eyebrow">Simple and useful</p>
        <h2 id="register-benefits-title">Your support, organised</h2>
        <p>Keep useful public information together for yourself or someone you care for.</p>
        <ul>
          <li><span aria-hidden="true">✓</span> No payment details required</li>
          <li><span aria-hidden="true">✓</span> Clear privacy choices</li>
          <li><span aria-hidden="true">✓</span> One place for saved information</li>
        </ul>
      </aside>
    </div>
  </section>
</template>
