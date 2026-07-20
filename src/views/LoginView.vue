<script setup>
import PageIntro from '@/components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="Welcome back"
    title="Log in to SilverCare"
    description="Use the account access form to return to your saved information."
  />

  <section class="section section--white" aria-labelledby="login-form-title">
    <div class="container auth-layout">
      <form class="auth-card" @submit.prevent>
        <h2 id="login-form-title">Account details</h2>
        <div class="field-group">
          <label for="login-email">Email address</label>
          <input id="login-email" name="email" type="email" autocomplete="email" />
        </div>
        <div class="field-group">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <label class="checkbox-field">
          <input type="checkbox" name="remember" />
          <span>Remember me on this device</span>
        </label>
        <button class="button button--full" type="submit">Log in</button>
        <p class="auth-switch">
          New to SilverCare? <RouterLink to="/register">Create an account</RouterLink>
        </p>
      </form>

      <aside class="auth-benefits" aria-labelledby="account-benefits-title">
        <p class="eyebrow">Your account</p>
        <h2 id="account-benefits-title">Keep useful support close by</h2>
        <ul>
          <li><span aria-hidden="true">✓</span> Save health resources to read later</li>
          <li><span aria-hidden="true">✓</span> Keep a shortlist of support options</li>
          <li><span aria-hidden="true">✓</span> Return to useful information in one place</li>
        </ul>
      </aside>
    </div>
  </section>
</template>
