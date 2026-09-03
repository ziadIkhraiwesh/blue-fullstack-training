<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
});
</script>

<template>
  <section class="unsupported-block">
    <div class="container">
      <p role="status">
        This content section is currently
        unavailable.
        <span>Unsupported type: {{ type }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.unsupported-block {
  padding-block: 2rem;
  color: #704d00;
  text-align: center;
  background-color: #fff4c2;
  border-block: 1px solid #e3ca61;
}

span {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.85rem;
}
</style>