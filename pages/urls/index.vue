<template>
  <main>
    <div class="form-wrapper">
      <form @submit.prevent @keyup.enter="searchEntered()">
        <label for="address-search" class="sr-only">Address Search</label>
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

    <div class="search-results" v-if="addressSearchAutoRes && searchHasFocus">
      <table>
        <thead>
          <tr>
            <!-- <th>Hits</th> -->
            <th>Originals</th>
            <th>Shorts</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r, i in addressSearchAutoRes" :key="r._id">
            <!-- <td>{{ r.hits }}</td> -->
            <td>{{ r.originalUrl }}</td>
            <td>{{ r.shortUrl }}</td>
            <td>
              <clickToCopy :id="i" :value="r.shortUrl" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <fn1-tabs v-if="urls && !searchHasFocus">
      <fn1-tab name="Your Urls" :selected="true">
        <table v-if="usersUrls.length">
          <thead>
            <tr>
              <th>Hits</th>
              <th>Originals</th>
              <th>Shorts</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u, i in usersUrls" :key="u._id">
              <td>{{ u.hits }}</td>
              <td>{{ u.originalUrl }}</td>
              <td>{{ u.shortUrl }}</td>
              <td>
                <clickToCopy :id="i" :value="u.shortUrl" />
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
              <!-- <th>Hits</th> -->
              <th>Originals</th>
              <th>Shorts</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u, i in urls" :key="u._id">
              <!-- <td>{{ u.hits }}</td> -->
              <td>{{ u.originalUrl }}</td>
              <td>{{ u.shortUrl }}</td>
              <td>
                <clickToCopy :id="i" :value="u.shortUrl" />
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
import clickToCopy from "~/components/design-system/clickToCopy.vue";

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
  components: { exampleSearch, clickToCopy },
  middleware: "authenticated",
  data() {
    return {
      urls: null,
      addressSearchAuto: null,
      addressSearchAutoRes: null,
      searchHasFocus: false,
    };
  },
  watch: {
    addressSearchAuto: debounce(function (val, oldVal) {
      if (this.addressSearchAuto) {
        this.$axios
          .$get(`${process.env.apiHost}/api/url/${this.addressSearchAuto}`, {
            withCredentials: true,
          })
          .then((res) => {
            this.addressSearchAutoRes = res;
          })
          .catch((err) => {
            console.log("Get URL Fail -", err);
          });
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
      }, 200);
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

  .search-results {
    margin: 20px 0 0 0;
  }

  .tabs-group {
    margin: 20px 0 0 0;
  }
}
</style>
