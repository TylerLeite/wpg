<script>
import { useResourceStore } from '@/stores/resource';

export default {
  setup() {
    const resources = useResourceStore();
    return {
      resources,
    }
  },
}
</script>

<template>
  <div class="resources"></div>
</template>

<style scoped></style>
