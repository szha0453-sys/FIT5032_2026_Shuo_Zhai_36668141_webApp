<template>
  <section class="hero">
    <div class="container hero__content">
      <h1>Find health information and support services</h1>
      <p class="hero__lead">Choose the type of help you need.</p>
      <div class="button-group">
        <RouterLink class="button" to="/resources">Browse health information</RouterLink>
        <RouterLink class="button button--secondary" to="/find-support">
          Find support services
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="contact-banner" aria-labelledby="contact-help-title">
    <div class="container contact-banner__inner">
      <div>
        <h2 id="contact-help-title">Not sure where to start?</h2>
        <p>Call our support team Monday to Friday, 9 am–5 pm.</p>
      </div>
      <a class="button button--light" href="tel:1800555019">Call 1800 555 019</a>
    </div>
  </section>
</template>
