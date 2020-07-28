<template>
  <div class="main-wrapper">
    <headerComp />
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  background: $color-blue;
  height: 100vh;
}

.main-content {
  overflow: auto;
  position: relative;
  margin: 0 auto;
  height: 100%;
}
</style>

<script>
import headerComp from "~/components/headerComp.vue";

export default {
  components: { headerComp },
};
</script>