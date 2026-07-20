<template>
  <header class="site-header">
    <div class="support-bar">
      <div class="container support-bar__inner">
        <p>Clear information. Local support. Simple next steps.</p>
        <a href="tel:1800555019">Need help? Call 1800 555 019</a>
      </div>
    </div>

    <div class="container header-main">
      <RouterLink class="brand" to="/" aria-label="SilverCare home">
        <svg class="brand__mark" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 41S7 31.2 7 18.2C7 10.5 16.6 7 24 14.5 31.4 7 41 10.5 41 18.2 41 31.2 24 41 24 41Z" />
          <path class="brand__spark" d="M24 16v16M16 24h16" />
        </svg>
        <span>Silver<span>Care</span></span>
      </RouterLink>
    </div>
  </header>
</template>
