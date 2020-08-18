<template>
  <main>
    <fn1-alert v-if="error">{{ error }}</fn1-alert>

    <template v-if="redirectUrl">
      <h4>redirecting ... {{ timeleft }} sec</h4>
      <h3>
        <a :href="redirectUrl" :title="redirectUrl" v-html="redirectUrl"></a>
      </h3>
      <!-- <embed :src="redirectUrl" width="600" height="400" /> -->
    </template>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  layout: "redirect",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$axios
        .$get(`${process.env.apiHost}/api/short/${to.params.id}`)
        .then((res) => {
          vm.redirectUrl = res;

          setInterval(() => {
            if (vm.timeleft <= 0) {
              window.location.href = res;
            } else {
              vm.timeleft -= 1;
            }
          }, 500);
        })
        .catch((err) => {
          vm.error = err.response.data;
        });
    });
  },
  components: {},
  data() {
    return {
      timeleft: 5,
      redirectUrl: null,
      error: null,
    };
  },
  watch: {},
  methods: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
main {
  z-index: 0;
  position: relative;
  width: 420px;
  margin: 0 auto;
  padding: 0;

  h3,
  h4,
  a {
    text-align: center;
  }

  h4 {
    color: rgba(255, 255, 255, 0.75);
    font-size: 20px;
  }

  h3,
  a {
    color: white;
    font-size: 24px;
  }

  embed {
    pointer-events: none;
    display: block;
    width: 100%;
  }
}
</style>
