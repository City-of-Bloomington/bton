<template>
  <main>
    <div class="auto-suggest-wrapper">
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
          <tr v-for="(r, i) in addressSearchAutoRes" :key="r._id">
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
            <tr v-for="(u, i) in usersUrls" :key="u._id">
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
            <tr v-for="(u, i) in urls" :key="u._id">
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

      <fn1-tab name="Whitelisted Urls" class="whitelisted" v-if="role == systemRoles.admin">
        <header>
          <fn1-badge>Role: {{ systemRoles.admin }}</fn1-badge>
          <p>
            Whitelisted Urls are those allowed by the system to be accepted when
            creating a new short Url.
          </p>
        </header>

        <fn1-alert
          v-if="
            createWhiteListUrlMessage.error || createWhiteListUrlMessage.success
          "
          :variant="{
            warning: createWhiteListUrlMessage.error,
            success: createWhiteListUrlMessage.success
          }"
        >
          <template v-if="createWhiteListUrlMessage.error">
            {{
            createWhiteListUrlMessage.error
            }}
          </template>

          <template v-if="createWhiteListUrlMessage.success">
            {{ createWhiteListUrlMessage.success.shortUrl }}
            <clickToCopy :id="0" :value="createWhiteListUrlMessage.success.shortUrl" />
          </template>
        </fn1-alert>

        <form @submit.prevent>
          <div class="field-group inline">
            <label for="whitelist-url">New Whitelist Url</label>

            <input
              type="text"
              v-model="whitelistedURLValue"
              label="New Whitelist Url"
              placeholder="eg: https://bloomington.in.gov"
              name="whitelist-url"
              id="whitelist-url"
            />

            <input type="submit" value="Create" @click="postNewWhitelistUrl()" />
          </div>
        </form>

        <table v-if="whitelistedUrls">
          <thead>
            <tr>
              <th>Accepted Urls</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(u, i) in whitelistedUrls" :key="u._id">
              <td>{{ u.url }}</td>
              <td>
                <button @click="deleteWhitelistUrl(u._id)">delete</button>
              </td>
            </tr>
          </tbody>
        </table>
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
      vm.getNewWhitelistUrl();

      vm.$axios
        .$get(
          `${process.env.apiHost}/api/urls?limit=${vm.limit}&skip=${vm.skip}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          vm.urls = res.urlRes;
          vm.totalUrls = res.total;
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
      totalUrls: null,
      limit: 10000,
      skip: 0,
      urls: null,
      addressSearchAuto: null,
      addressSearchAutoRes: null,
      searchHasFocus: false,
      whitelistedURLValue: null,
      whitelistedUrls: null,
      createWhiteListUrlMessage: {
        success: null,
        error: null,
      },
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
    postNewWhitelistUrl() {
      let url = this.stripTrailingSlash(this.whitelistedURLValue);

      this.$axios
        .$post(
          `${process.env.apiHost}/api/url/whitelist`,
          { url: url },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("postNewWhitelistUrl res", res);
          this.createWhiteListUrlMessage.success = res.data;
          this.getNewWhitelistUrl();
        })
        .catch((err) => {
          this.createWhiteListUrlMessage.error = err.response.data;
          console.log("postNewWhitelistUrl fail", err);
        });
    },
    getNewWhitelistUrl() {
      this.$axios
        .$get(`${process.env.apiHost}/api/urls/whitelist`, {
          withCredentials: true,
        })
        .then((res) => {
          this.whitelistedUrls = res.urlRes;
          console.log("getNewWhitelistUrl res", res.urlRes);
        })
        .catch((err) => {
          console.log("getNewWhitelistUrl fail", err);
        });
    },
    deleteWhitelistUrl(id) {
      this.$axios
        .$delete(`${process.env.apiHost}/api/urls/whitelist/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log("deleteWhitelistUrl res", res);
          this.getNewWhitelistUrl();
        })
        .catch((err) => {
          console.log("deleteWhitelistUrl fail", err);
        });
    },
  },
  computed: {
    ...mapFields(["systemRoles", "authenticated", "user", "user.user.role"]),
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

  .tab-pane {
    header {
      // background: red;
      margin: 0 0 20px 0;
      padding: 0 0 20px 0;
      border-bottom: 1px solid $color-grey;

      .badge {
        margin: 0 0 20px 0;
      }

      p {
        font-size: 16px;
        color: lighten($text-color, 5%);
        font-weight: 600;
      }
    }

    &.whitelisted {
      .field-group {
        margin: 0 0 20px 0;
        padding: 0 0 20px 0;
      }
    }
  }
}
</style>
