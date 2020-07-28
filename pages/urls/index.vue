<template>
  <main>
    <div class="form-wrapper">
      <form @submit.prevent @keyup.enter="searchEntered()">
        <label for="address-search" class="sr-only">Address Search</label>
        <p>{{ searchHasFocus }}</p>
        <exampleSearch
          v-model="addressSearchAuto"
          v-on:focusd="sFocus()"
          v-on:blurd="sBlur()"
          placeholder="Search Originals"
          ref="addressSearch"
          name="address-search"
          id="address-search"
        />
      </form>
    </div>

    <fn1-tabs v-if="urls">
      <fn1-tab name="Your Urls" :selected="true">
        <table v-if="usersUrls.length">
          <thead>
            <tr>
              <th>Originals</th>
              <th>Shorts</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u, i in usersUrls" :key="u._id">
              <td>{{ u.originalUrl }}</td>
              <td>{{ u.shortUrl }}</td>
              <td>
                <input type="hidden" :id="`short-url-copy-${i}`" :value="u.shortUrl" />
                <button class="btn copy" @click="copyTestingCode(i)">copy</button>
                <!-- <button class="btn" @click="deleteURL(u._id)">delete</button> -->
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else>
          <strong>Sorry,</strong> you don't have any URLs yet.
        </p>
      </fn1-tab>

      <fn1-tab name="All Urls">
        <table v-if="urls.length">
          <thead>
            <tr>
              <th>Originals</th>
              <th>Shorts</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u, i in urls" :key="u._id">
              <td>{{ u.originalUrl }}</td>
              <td>{{ u.shortUrl }}</td>
              <td>
                <input type="hidden" :id="`short-url-copy-${i}`" :value="u.shortUrl" />
                <button class="btn copy" @click="copyTestingCode(i)">copy</button>
                <!-- <button class="btn" @click="deleteURL(u._id)">delete</button> -->
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else>
          <strong>Sorry,</strong> the system looks empty.
        </p>
      </fn1-tab>
    </fn1-tabs>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import exampleSearch from "~/components/design-system/exampleSearch";

import debounce from "lodash.debounce";

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$axios
        .$get(`${process.env.apiHost}/api/urls`, {
          withCredentials: true,
        })
        .then((res) => {
          vm.urls = res;
        })
        .catch((err) => {
          console.log("Get URLs Fail -", err);
        });
    });
  },
  mounted() {},
  components: { exampleSearch },
  middleware: "authenticated",
  data() {
    return {
      urls: null,
      addressSearchAuto: null,
      searchHasFocus: false,
    };
  },
  watch: {
    addressSearchAuto: debounce(function (val, oldVal) {
      if (this.addressSearchAuto) {
        console.log("cool");
      } else {
        this.autoSuggestRes = null;
      }
    }, 500),
  },
  methods: {
    sFocus() {
      this.searchHasFocus = true;
    },
    sBlur() {
      setTimeout(() => {
        this.searchHasFocus = false;
      }, 500);
    },
    deleteURL(id) {
      this.$axios
        .$delete(`${process.env.apiHost}/api/short/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log("rm", res);
        })
        .catch((err) => {
          console.log("rm fail", err);
        });
    },
    copyUrl(url) {
      url.execCommand("copy");
    },
    copyTestingCode(id) {
      let testingCodeToCopy = document.querySelector(`#short-url-copy-${id}`);
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();

      try {
        let successful = document.execCommand("copy");
        alert(
          `Short URL copied:\n ${JSON.parse(
            JSON.stringify(testingCodeToCopy._value)
          )}`
        );
      } catch (err) {
        alert("Oops, unable to copy");
      }

      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
  },
  computed: {
    ...mapFields(["authenticated", "user"]),
    usersUrls() {
      return this.urls.filter((url) => url.owner === this.user.user.username);
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  z-index: 0;
  position: relative;
  top: 140px;
  width: 840px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: $radius-default;

  table {
    color: $text-color;
  }
}
</style>
