<template>
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="eyebrow">Support for ageing well</p>
        <h1>Clear support, when you need it.</h1>
        <p class="hero__lead">
          Find trusted health information and local services for older Australians, families and
          carers—all in one easy-to-use place.
        </p>
        <div class="button-group">
          <RouterLink class="button" to="/find-support">Explore support options</RouterLink>
          <RouterLink class="button button--secondary" to="/resources">
            Browse resources
          </RouterLink>
        </div>
        <ul class="trust-list" aria-label="SilverCare service benefits">
          <li><span aria-hidden="true">✓</span> Plain-language information</li>
          <li><span aria-hidden="true">✓</span> Free to use</li>
          <li><span aria-hidden="true">✓</span> Designed for accessibility</li>
        </ul>
      </div>

      <div class="hero__visual" aria-hidden="true">
        <div class="hero__circle hero__circle--large"></div>
        <div class="hero__circle hero__circle--small"></div>
        <div class="support-card support-card--phone">
          <span class="support-card__icon">☎</span>
          <span>Someone to talk to</span>
          <strong>1800 555 019</strong>
        </div>
        <div class="support-card support-card--location">
          <span class="support-card__icon">⌖</span>
          <span>Support pathways</span>
          <strong>Find the right next step</strong>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--white" aria-labelledby="quick-paths-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">How can we help?</p>
          <h2 id="quick-paths-title">Choose what you need today</h2>
        </div>
        <p>Start with a clear pathway and explore the public information at your own pace.</p>
      </div>

      <div class="card-grid card-grid--three">
        <article class="path-card">
          <span class="path-card__number">01</span>
          <h3>Health information</h3>
          <p>Read practical guidance on healthy ageing, wellbeing and common conditions.</p>
          <RouterLink to="/resources">
            Explore health resources <span aria-hidden="true">→</span>
          </RouterLink>
        </article>
        <article class="path-card path-card--amber">
          <span class="path-card__number">02</span>
          <h3>Support for carers</h3>
          <p>Find information for family members and carers, including support contacts.</p>
          <RouterLink to="/resources">
            View caregiver guides <span aria-hidden="true">→</span>
          </RouterLink>
        </article>
        <article class="path-card path-card--blue">
          <span class="path-card__number">03</span>
          <h3>Support options</h3>
          <p>Explore community health, mobility, social connection and practical support.</p>
          <RouterLink to="/find-support">
            Explore support pathways <span aria-hidden="true">→</span>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>

  <section class="section reassurance-section" aria-labelledby="why-silvercare-title">
    <div class="container reassurance-grid">
      <div>
        <p class="eyebrow">Made to feel easier</p>
        <h2 id="why-silvercare-title">Support without the confusion</h2>
        <p class="large-copy">
          SilverCare brings reliable information and practical next steps together, with readable
          pages and simple navigation designed around real needs.
        </p>
      </div>
      <ul class="feature-list">
        <li>
          <span class="feature-list__icon" aria-hidden="true">A</span>
          <div>
            <strong>Easy to read</strong>
            <span>Clear language, readable type and uncluttered pages.</span>
          </div>
        </li>
        <li>
          <span class="feature-list__icon" aria-hidden="true">✓</span>
          <div>
            <strong>Trusted guidance</strong>
            <span>Useful pathways informed by Australian support services.</span>
          </div>
        </li>
        <li>
          <span class="feature-list__icon" aria-hidden="true">⌖</span>
          <div>
            <strong>Local next steps</strong>
            <span>Move from information to nearby support with confidence.</span>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <section class="contact-banner">
    <div class="container contact-banner__inner">
      <div>
        <p class="eyebrow">Prefer to speak with someone?</p>
        <h2>Our support team is here to help.</h2>
      </div>
      <a class="button button--light" href="tel:1800555019">Call 1800 555 019</a>
    </div>
  </section>
</template>
