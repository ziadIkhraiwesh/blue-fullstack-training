<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const isInternalLink = computed(() => {
  return props.data.button_url?.startsWith(
    "/"
  );
});
</script>

<template>
  <section class="content-block cta-block">
    <div class="container cta-content">
      <h2>{{ data.heading }}</h2>

      <p v-if="data.text">
        {{ data.text }}
      </p>

      <RouterLink
        v-if="isInternalLink"
        class="button cta-button"
        :to="data.button_url"
      >
        {{ data.button_label }}
      </RouterLink>

      <a
        v-else
        class="button cta-button"
        :href="data.button_url"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ data.button_label }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.cta-block {
  padding-block: 4rem;
  color: #ffffff;
  text-align: center;
  background-color: var(--color-primary);
}

.cta-content {
  max-width: 850px;
}

h2 {
  margin-bottom: 1rem;
  font-size: clamp(1.9rem, 5vw, 3rem);
}

p {
  max-width: 650px;
  margin: 0 auto 1.5rem;
  line-height: 1.8;
}

.cta-button {
  display: inline-flex;
  color: var(--color-primary);
  text-decoration: none;
  background-color: #ffffff;
}

.cta-button:hover {
  color: #ffffff;
  background-color: var(--color-secondary);
}
</style>