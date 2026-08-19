<template>
  <section class="section contact-view">
    <div class="container contact-layout">
      <div>
        <p class="eyebrow-text">Start a Conversation</p>
        <h1>Contact NexaTech</h1>

        <p class="description">
          Contact our team to discuss a digital project, Vue application,
          or business technology requirement.
        </p>
      </div>

      <div class="contact-card">
        <h2>Get in Touch</h2>

        <dl>
          <div>
            <dt>Location</dt>
            <dd>Nablus Street, Al-Bireh, Palestine</dd>
          </div>

          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:info@nexatech.example">
                info@nexatech.example
              </a>
            </dd>
          </div>

          <div>
            <dt>Phone</dt>
            <dd>
              <a href="tel:+97022929090">+970 2 292 9090</a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-view {
  min-height: calc(100vh - 72px);
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 3rem;
}

h1 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2.5rem, 5vw, 4rem);
}

.description {
  max-width: 620px;
  color: var(--color-text-muted);
  line-height: 1.8;
}

.contact-card {
  padding: 2rem;
  color: #ffffff;
  background-color: var(--color-primary);
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
}

.contact-card h2 {
  margin-bottom: 1.5rem;
}

dl {
  display: grid;
  gap: 1.5rem;
}

dl div {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

dl div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

dt {
  margin-bottom: 0.5rem;
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

dd,
dd a {
  color: #ffffff;
}

@media (max-width: 768px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}
</style>