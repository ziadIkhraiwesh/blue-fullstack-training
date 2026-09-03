<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="content-block text-block">
    <div class="container text-content">
      <h2 v-if="data.heading">
        {{ data.heading }}
      </h2>

      <div class="body-content">
        {{ data.body }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-block {
  padding-block: 4rem;
  background-color: var(--color-surface);
}

.text-content {
  max-width: 850px;
}

h2 {
  margin-bottom: 1.25rem;
  color: var(--color-primary);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}

.body-content {
  color: var(--color-text);
  line-height: 1.9;
  white-space: pre-wrap;
}
</style>