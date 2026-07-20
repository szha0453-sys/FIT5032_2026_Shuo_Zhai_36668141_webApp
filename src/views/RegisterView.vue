<script setup>
import PageIntro from '@/components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="Join SilverCare"
    title="Create your account"
    description="Use the account form to organise information and support options that matter to you."
  />

  <section class="section section--white" aria-labelledby="register-form-title">
    <div class="container auth-layout">
      <form class="auth-card" @submit.prevent>
        <h2 id="register-form-title">Your details</h2>
        <div class="field-group">
          <label for="register-name">Full name</label>
          <input id="register-name" name="name" type="text" autocomplete="name" />
        </div>
        <div class="field-group">
          <label for="register-email">Email address</label>
          <input id="register-email" name="email" type="email" autocomplete="email" />
        </div>
        <div class="field-group">
          <label for="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autocomplete="new-password"
            aria-describedby="password-help"
          />
          <p id="password-help" class="field-help">
            Choose a password you do not use for another account.
          </p>
        </div>
        <div class="field-group">
          <label for="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
          />
        </div>
        <label class="checkbox-field">
          <input type="checkbox" name="terms" />
          <span>I agree to the terms and privacy notice.</span>
        </label>
        <button class="button button--full" type="submit">Create account</button>
        <p class="auth-switch">
          Already have an account? <RouterLink to="/login">Log in</RouterLink>
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
