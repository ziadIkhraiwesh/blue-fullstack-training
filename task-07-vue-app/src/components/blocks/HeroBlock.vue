<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="content-block hero-block">
    <div class="container hero-content">
      <p class="eyebrow-text">
        Reusable Hero Block
      </p>

      <h1>{{ data.heading }}</h1>

      <p v-if="data.subheading">
        {{ data.subheading }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero-block {
  padding-block: 5rem;
  text-align: center;
  background:
    linear-gradient(
      135deg,
      #e8f6fc,
      #ffffff
    );
}

.hero-content {
  max-width: 950px;
}

h1 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2.3rem, 7vw, 4.5rem);
  line-height: 1.1;
}

p:not(.eyebrow-text) {
  max-width: 750px;
  margin: 0 auto;
  color: var(--color-text-muted);
  font-size: 1.15rem;
  line-height: 1.8;
}
</style>