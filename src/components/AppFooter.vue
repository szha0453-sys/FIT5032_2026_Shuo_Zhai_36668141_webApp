<script setup>
import { isStaff } from '@/stores/auth'
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <section aria-labelledby="footer-about">
        <h2 id="footer-about" class="footer-brand">SilverCare</h2>
        <p>Helping older Australians and carers find trusted information and local support.</p>
      </section>

      <nav aria-labelledby="footer-explore">
        <h2 id="footer-explore">Explore</h2>
        <ul class="footer-links">
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/resources">Health resources</RouterLink></li>
          <li><RouterLink to="/find-support">Find support</RouterLink></li>
          <li v-if="isStaff"><RouterLink to="/staff">Staff area</RouterLink></li>
          <li v-else><RouterLink to="/account">My account</RouterLink></li>
        </ul>
      </nav>

      <section aria-labelledby="footer-contact">
        <h2 id="footer-contact">Contact</h2>
        <p><a href="tel:1800555019">1800 555 019</a></p>
        <p><a href="mailto:hello@silvercare.org.au">hello@silvercare.org.au</a></p>
        <p class="footer-note">For emergencies, call 000.</p>
      </section>
    </div>
    <div class="container footer-bottom">
      <p>&copy; 2026 SilverCare</p>
    </div>
  </footer>
</template>
