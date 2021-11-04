<template>
  <main>
    <section class="search">
      <form @submit.prevent="submitURL()">
        <legend for="tool-search">Shorten a URL</legend>
        <p>
          <small>
            <strong>Note:</strong> Only {{ passlistTerm }} Urls allowed.
          </small>
        </p>

        <fn1-alert
          v-if="createPostMessage.error || createPostMessage.success"
          :variant="{
            warning: createPostMessage.error,
            success: createPostMessage.success
          }"
        >
          <template v-if="createPostMessage.error">
            <p>{{ createPostMessage.error.message }}</p>

            <template v-if="createPostMessage.error.url">
              <hr />

              {{ createPostMessage.error.url[0].shortUrl }}

              <clickToCopy
                :id="0"
                :value="createPostMessage.error.url[0].shortUrl"
              />
            </template>
          </template>

          <template v-if="createPostMessage.success">
            <template v-if="createPostMessage.success.delayPreview">
              {{ createPostMessage.success.shortUrl }}+
              <clickToCopy
                :id="0"
                :value="`${createPostMessage.success.shortUrl}+`"
              />
            </template>

            <template v-else>
              {{ createPostMessage.success.shortUrl }}
              <clickToCopy
                :id="0"
                :value="createPostMessage.success.shortUrl"
              />
            </template>
          </template>
        </fn1-alert>

        <div class="field-group checkbox">
          <label for="delay-preview">
            Enable Destination Url preview?
          </label>

          <input
            type="checkbox"
            v-model="urlDelay"
            id="delay-preview"
            name="delay-preview"
          />
        </div>

        <div class="field-group">
          <label for="url-label">
            Label
          </label>

          <input
            v-model="urlLabel"
            autocomplete="off"
            id="url-label"
            type="search"
            name="url-label"
            placeholder="Lunch Menu"
          />
        </div>

        <div class="field-group">
          <label for="create-url">
            Url
          </label>

          <input
            v-model="urlInput"
            autocomplete="off"
            id="reate-url"
            type="search"
            name="reate-url"
            placeholder="eg. https://bloomington.in.gov/ureport"
          />
        </div>

        <input type="submit" value="Shorten Url" />
      </form>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { mapFields } from "vuex-map-fields";
import clickToCopy from "~/components/design-system/clickToCopy.vue";

export default {
  components: { clickToCopy },
  middleware: "authenticated",
  async fetch() {
    const cookieRes = this.$cookies.getAll();

    const whitelistRes = await axios.get(
      `${process.env.apiHost}/api/urls/whitelist`,
      {
        withCredentials: true,
        headers: { Cookie: `sid=${cookieRes.sid}` }
      }
    );

    let whitelistArray = [...whitelistRes.data.urlRes],
      result = whitelistArray.filter(res => res.url).map(ele => ele.url);

    this.whitelist = result;
  },
  data() {
    return {
      radical: null,
      whitelist: null,
      passWhitelist: false,
      createPostMessage: {
        success: null,
        error: null
      },
      urlInput: "",
      urlLabel: "",
      urlDelay: false
    };
  },
  watch: {},
  methods: {
    submitURL() {
      var matchUrl = require("match-url-wildcard");

      if (this.urlInput) {
        this.createPostMessage = {
          success: null,
          error: null
        };

        for (let r of this.whitelist) {
          if (matchUrl(this.urlInput, r)) {
            console.log(matchUrl(this.urlInput, r));
            this.passWhitelist = true;
            break;
          }
        }

        if (this.passWhitelist) {
          let url = this.stripTrailingSlash(this.urlInput);

          this.$axios
            .$post(
              `${process.env.apiHost}/api/url`,
              { url: url, delayPreview: this.urlDelay, label: this.urlLabel },
              {
                withCredentials: true
              }
            )
            .then(res => {
              this.createPostMessage.success = res;
              this.urlInput = "";
              this.urlLabel = "";
              this.urlDelay = false;
            })
            .catch(err => {
              this.createPostMessage.error = err.response.data;
            });
        } else {
          this.createPostMessage.error = {
            message: `Url not ${this.passlistTerm} accepted.`,
            url: null
          };
        }
      } else {
        this.createPostMessage.error = { message: "Enter a Url.", url: null };
      }
    }
  },
  computed: {
    ...mapFields(["authenticated", "user"]),
    isAdmin() {
      if (this.user != null)
        if (this.user.user != null)
          if (this.user.user.role == "admin") return true;

      return false;
    },
    passlistTerm() {
      return process.env.passListTerm;
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  z-index: 0;
  position: relative;
  width: 420px;
  margin: 0 auto;
  top: 150px;

  .alert {
    display: flex;
    align-items: center;

    .click-to-copy-wrapper {
      margin: 0 0 0 auto;
    }
  }

  section {
    &.search {
      background: white;
      border-radius: $radius-default;
      padding: 20px;
    }
  }

  form {
    input[type="submit"] {
      margin: 20px 0 0 0;
      width: 100%;
      font-weight: 600;
      font-size: 18px;
      padding: 8px 16px 9px;
    }
  }
}
</style>
