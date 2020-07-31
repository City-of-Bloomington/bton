<template>
  <main>
    <section class="search">
      <form @submit.prevent="submitURL()">
        <label for="tool-search">Shorten a URL</label>
        <p>
          <small>
            <strong>Note:</strong> Only City of Bloomington URLs are allowed.
          </small>
        </p>

        <fn1-alert
          v-if="createPostMessage.error || createPostMessage.success"
          :variant="{'warning':createPostMessage.error, 'success':createPostMessage.success}"
        >
          <template v-if="createPostMessage.error">{{ createPostMessage.error }}</template>

          <template v-if="createPostMessage.success">
            {{ createPostMessage.success.shortUrl }}
            <clickToCopy :id="0" :value="createPostMessage.success.shortUrl" />
          </template>
        </fn1-alert>

        <div class="field-group">
          <input
            v-model="urlInput"
            autocomplete="off"
            id="tool-search"
            type="search"
            name="tool-search"
            placeholder="eg. https://bloomington.in.gov/ureport"
          />

          <input type="submit" value="Shorten URL" />
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import clickToCopy from "~/components/design-system/clickToCopy.vue";

export default {
  mounted() {},
  components: { clickToCopy },
  middleware: "authenticated",
  data() {
    return {
      createPostMessage: {
        success: null,
        error: null,
      },
      urlInput: null,
    };
  },
  watch: {},
  methods: {
    // needs ported to back-end too
    isBloomingtonURL(url) {
      let res = url.match(
        /(https?:\/\/(.+?\.)?bloomington\.in\.gov(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/g
      );
      return res !== null;
    },
    stripTrailingSlash(str) {
      return str.endsWith("/") ? str.slice(0, -1) : str;
    },
    submitURL() {
      if (this.urlInput) {
        this.createPostMessage = {
          success: null,
          error: null,
        };

        let url = this.stripTrailingSlash(this.urlInput);

        if (this.isBloomingtonURL(url)) {
          this.$axios
            .$post(
              `${process.env.apiHost}/api/url`,
              { url: url },
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              this.createPostMessage.success = res;
              this.urlInput = null;
            })
            .catch((err) => {
              this.createPostMessage.error = err.response.data;
            });
        } else {
          this.createPostMessage.error =
            "Only City of Bloomington URLs allowed.";
        }
      } else {
        this.createPostMessage.error = "Enter a URL";
      }
    },
  },
  computed: {
    ...mapFields(["authenticated", "user"]),
    isAdmin() {
      if (this.user != null)
        if (this.user.user != null)
          if (this.user.user.role == "admin") return true;

      return false;
    },
  },
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
      font-weight: 600;
      font-size: 18px;
      margin: 0;

      &:hover,
      &:focus {
        background: darken($color-fern, 5%);
      }
    }
  }
}
</style>
