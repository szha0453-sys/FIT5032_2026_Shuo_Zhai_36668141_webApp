<script setup>
import PageIntro from '@/components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="Local services"
    title="Find the right type of support"
    description="Explore common service pathways for health, caring, mobility and community connection."
  />

  <section class="section section--white" aria-labelledby="support-types-title">
    <div class="container">
      <div class="section-heading section-heading--compact">
        <div>
          <p class="eyebrow">Support pathways</p>
          <h2 id="support-types-title">How can we help?</h2>
        </div>
        <p>Choose a pathway below, or call our team if you are unsure where to begin.</p>
      </div>

      <div class="support-options">
        <article class="support-option">
          <span aria-hidden="true">+</span>
          <div>
            <h3>Community health</h3>
            <p>Find everyday health, nursing and allied health services in your community.</p>
          </div>
        </article>
        <article class="support-option">
          <span aria-hidden="true">↗</span>
          <div>
            <h3>Transport assistance</h3>
            <p>Learn about options for reaching appointments and essential local services.</p>
          </div>
        </article>
        <article class="support-option">
          <span aria-hidden="true">♥</span>
          <div>
            <h3>Carer support</h3>
            <p>Explore information, respite pathways and practical help for carers.</p>
          </div>
        </article>
        <article class="support-option">
          <span aria-hidden="true">◎</span>
          <div>
            <h3>Social connection</h3>
            <p>Discover community groups and activities that help people stay connected.</p>
          </div>
        </article>
      </div>

      <aside class="support-help-card" aria-labelledby="support-help-title">
        <div>
          <p class="eyebrow">Not sure where to start?</p>
          <h2 id="support-help-title">Talk to our support team</h2>
          <p>We can help you identify the right type of service and explain the next step.</p>
        </div>
        <div class="support-help-card__contact">
          <a class="button" href="tel:1800555019">Call 1800 555 019</a>
          <span>Monday to Friday, 9 am–5 pm</span>
        </div>
      </aside>
    </div>
  </section>
</template>
