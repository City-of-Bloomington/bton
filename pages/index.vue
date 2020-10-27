<template>
  <main>
    <section class="search">
      <form @submit.prevent="submitURL()">
        <label for="tool-search">Shorten a URL</label>
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
            {{ createPostMessage.success.shortUrl }}
            <clickToCopy :id="0" :value="createPostMessage.success.shortUrl" />
          </template>
        </fn1-alert>

        <div class="field-group checkbox">
          <input
            type="checkbox"
            v-model="urlDelay"
            id="delay-preview"
            name="delay-preview"
          />
          <label for="delay-preview">
            Enable Destination Url preview?
          </label>
        </div>

        <div class="field-group">
          <input
            v-model="urlInput"
            autocomplete="off"
            id="tool-search"
            type="search"
            name="tool-search"
            placeholder="eg. https://bloomington.in.gov/ureport"
          />

          <input type="submit" value="Shorten Url" />
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import clickToCopy from "~/components/design-system/clickToCopy.vue";

export default {
  components: { clickToCopy },
  middleware: "authenticated",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$axios
        .$get(`${process.env.apiHost}/api/urls/whitelist`, {
          withCredentials: true
        })
        .then(res => {
          let whitelistRes = [...res.urlRes],
            result = whitelistRes.filter(res => res.url).map(ele => ele.url);

          vm.whitelist = result;
        })
        .catch(err => {
          console.log("Get URLs Fail -", err);
        });
    });
  },
  data() {
    return {
      whitelist: null,
      passWhitelist: false,
      createPostMessage: {
        success: null,
        error: null
      },
      urlInput: null,
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
              { url: url, delayPreview: this.urlDelay },
              {
                withCredentials: true
              }
            )
            .then(res => {
              this.createPostMessage.success = res;
              this.urlInput = null;
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

  .field-group {
    &.checkbox {
      align-items: center;

      input {
        margin: 0 10px 0 0;
      }

      label {
        border-bottom: none;
        color: lighten($text-color, 15%);
        font-weight: 600;
        font-size: 14px;
        margin: 0;
        padding: 0;
      }
    }
  }

  form {
    input {
      box-shadow: none;
      margin: 0 0 15px 0;
      border: 1px solid darken($color-grey, 5%);
      border-radius: $radius-default !important;

      &:hover,
      &:focus {
        box-shadow: none;
        outline: none;
        border: 1px solid darken($color-grey, 15%);
      }
    }

    label {
      display: block;
      color: $text-color;
      font-weight: 600;
      font-size: 28px;
      margin: 0 0 10px 0;
      padding: 0 0 10px 0;
      border-bottom: 1px solid $color-grey;
    }

    p {
      color: lighten($text-color, 15%);
      margin: 0 0 10px 0;

      small {
        color: lighten($text-color, 15%);
        font-weight: 600;
        font-size: 14px;

        strong {
          color: $text-color;
        }
      }
    }

    input[type="submit"] {
      cursor: pointer;
      background: $color-fern;
      border: 1px solid darken($color-fern, 2%);
      color: white;
      width: 100%;
      font-weight: 600;
      font-size: 18px;
      margin: 0;
    }
  }
}
</style>
