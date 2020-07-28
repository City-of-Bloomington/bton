<template>
  <main>
    <fn1-alert v-if="error">{{ error }}</fn1-alert>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$axios
        .$get(`${process.env.apiHost}/api/short/${to.params.id}`)
        .then((res) => {
          window.location.href = res;
        })
        .catch((err) => {
          vm.error = err.response.data;
        });
    });
  },
  mounted() {
    // this.$axios.$get(`${process.env.apiHost}/api/applications`)
    // .then((res)  => {
    //   this.tools = res;
    //   this.getLogos();
    // })
    // .catch((err) => { console.log('Get App Logo via ID Fail -', err) });
  },
  components: {},
  data() {
    return {
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
  padding: 100px 0 0 0;

  form {
    input {
      box-shadow: none;
      margin: 0 0 20px 0;
    }

    label {
      color: white;
      font-weight: 600;
      font-size: 28px;
      margin: 0 0 20px 0;
    }

    input[type="submit"] {
      background: $color-fern;
      border: 1px solid darken($color-fern, 2%);
      color: white;
      font-weight: 600;
      font-size: 18px;
      margin: 0;
    }
  }
}
</style>
