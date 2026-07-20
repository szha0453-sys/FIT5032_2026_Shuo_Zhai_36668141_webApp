<script setup>
import PageIntro from '@/components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="Health library"
    title="Information you can understand and use"
    description="Explore practical guidance for healthy ageing, caring and everyday wellbeing."
  />

  <section class="section section--white" aria-labelledby="resource-categories-title">
    <div class="container">
      <div class="section-heading section-heading--compact">
        <div>
          <p class="eyebrow">Browse by topic</p>
          <h2 id="resource-categories-title">Choose a resource category</h2>
        </div>
        <p>Start with the topic that best matches what you need today.</p>
      </div>

      <div class="card-grid card-grid--three">
        <article class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">H</span>
          <h3>Healthy ageing</h3>
          <p>Everyday steps for staying active, independent and connected.</p>
        </article>
        <article class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">M</span>
          <h3>Mental wellbeing</h3>
          <p>Support for emotional wellbeing, loneliness, grief and stress.</p>
        </article>
        <article class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">C</span>
          <h3>Condition support</h3>
          <p>Plain-language information for managing common health conditions.</p>
        </article>
        <article class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">Rx</span>
          <h3>Medication safety</h3>
          <p>Tips for understanding medicines and speaking with health professionals.</p>
        </article>
        <article class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">N</span>
          <h3>Nutrition and exercise</h3>
          <p>Practical guidance for eating well and moving safely.</p>
        </article>
        <article class="resource-card">
          <span class="resource-card__icon" aria-hidden="true">♥</span>
          <h3>Caregiver guides</h3>
          <p>Information, respite pathways and support contacts for carers.</p>
        </article>
      </div>

      <aside class="information-note" aria-labelledby="resource-note-title">
        <span class="information-note__icon" aria-hidden="true">i</span>
        <div>
          <h2 id="resource-note-title">Health information notice</h2>
          <p>
            SilverCare provides general information and does not replace advice from your doctor
            or another qualified health professional. In an emergency, call 000.
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>
