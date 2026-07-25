<script setup>
import PageIntro from '@/components/PageIntro.vue'
import { currentUser } from '@/stores/auth'
</script>

<template>
  <PageIntro
    eyebrow="Staff workspace"
    title="Staff area"
    :description="`Welcome, ${currentUser?.name}. Review the public information maintained by the SilverCare team.`"
  />

  <section class="section section--white" aria-labelledby="staff-overview-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Workspace overview</p>
          <h2 id="staff-overview-title">Manage SilverCare information</h2>
        </div>
        <p>Review resources, support pathways and account information in one place.</p>
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
          <p>Account information and saved resources available to registered users.</p>
        </article>
      </div>
    </div>
  </section>
</template>
