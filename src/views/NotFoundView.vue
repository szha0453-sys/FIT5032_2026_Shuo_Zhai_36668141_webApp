<template>
  <section class="status-page">
    <div class="container status-page__inner">
      <p class="status-code">404</p>
      <h1>We could not find that page</h1>
      <p>The address may be incorrect, or the page may have moved.</p>
      <div class="button-group button-group--center">
        <RouterLink class="button" to="/">Return home</RouterLink>
        <RouterLink class="button button--secondary" to="/find-support">
          Find support
        </RouterLink>
      </div>
    </div>
  </section>
</template>
