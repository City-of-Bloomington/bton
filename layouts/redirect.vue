<template>
  <div class="main-wrapper">
    <headerComp :redirect="true" />
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
  display: flex;
  align-items: center;
  justify-content: center;
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