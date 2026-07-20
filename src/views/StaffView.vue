<script setup>
import PageIntro from '@/components/PageIntro.vue'
</script>

<template>
  <PageIntro
    eyebrow="Staff workspace"
    title="Staff area"
    description="Review the types of public information maintained by the SilverCare team."
  />

  <section class="section section--white" aria-labelledby="staff-overview-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Content overview</p>
          <h2 id="staff-overview-title">Information areas</h2>
        </div>
        <p>The functional management controls will be introduced with role-based access.</p>
      </div>

      <div class="card-grid card-grid--three">
        <article class="management-card">
          <span aria-hidden="true">R</span>
          <h3>Health resources</h3>
          <p>Public guidance and resource categories available through SilverCare.</p>
        </article>
        <article class="management-card">
          <span aria-hidden="true">S</span>
          <h3>Support information</h3>
          <p>Service pathways, contact details and accessibility information.</p>
        </article>
        <article class="management-card">
          <span aria-hidden="true">A</span>
          <h3>Account area</h3>
          <p>The account-facing information that will support registered users.</p>
        </article>
      </div>
    </div>
  </section>
</template>
