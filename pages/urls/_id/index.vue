<template>
  <main>
    <h3>
      Edit Url Code:
      <template v-if="url">{{ url.urlCode }}</template>
    </h3>

    <fn1-alert
      v-if="editUrlMessage.error || editUrlMessage.success"
      :variant="{
        warning: editUrlMessage.error,
        success: editUrlMessage.success
      }"
    >
      <template v-if="editUrlMessage.error">
        {{ editUrlMessage.error }}
      </template>

      <template v-if="editUrlMessage.success">
        Saved: {{ editUrlMessage.success.saved }}
      </template>
    </fn1-alert>

    <form v-if="url">
      <div class="field-group checkbox">
        <label for="delayPreview">Delay (5s) &amp; go-to Url Preview</label>
        <input
          type="checkbox"
          id="delayPreview"
          name="delayPreview"
          v-model="url.delayPreview"
        />
      </div>

      <div class="field-group">
        <label for="created-date">Created Date</label>
        <input
          disabled="disabled"
          v-model="url.createdDate"
          autocomplete="off"
          id="created-date"
          type="text"
          name="created-date"
        />
      </div>

      <div class="field-group">
        <label for="modified-date">Last Modified</label>
        <input
          disabled="disabled"
          v-model="url.updatedDate"
          autocomplete="off"
          id="modified-date"
          type="text"
          name="modified-date"
        />
      </div>

      <div class="field-group">
        <label for="url-owner">Owner</label>
        <input
          disabled="disabled"
          v-model="url.owner"
          autocomplete="off"
          id="url-owner"
          type="text"
          name="url-owner"
        />
      </div>

      <div class="field-group">
        <label for="original-url">Original Url</label>
        <input
          v-model="url.originalUrl"
          autocomplete="off"
          id="original-url"
          type="text"
          name="original-url"
        />
      </div>

      <div class="field-group">
        <label for="url-short-code">Url Short Code</label>
        <input
          disabled="disabled"
          v-model="url.urlCode"
          autocomplete="off"
          id="url-short-code"
          type="text"
          name="url-short-code"
        />
      </div>

      <!-- <input type="submit" value="Save" /> -->
    </form>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import debounce from "lodash.debounce";

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$axios
        .$get(`${process.env.apiHost}/api/url/${to.params.id}`, {
          withCredentials: true
        })
        .then(res => {
          vm.url = res[0];
        })
        .catch(err => {
          console.log("Get URL Fail -", err);
        });
    });
  },
  mounted() {},
  components: {},
  middleware: "authenticated",
  data() {
    return {
      url: null,
      editUrlMessage: {
        success: null,
        error: null
      }
    };
  },
  watch: {
    originalUrl: debounce(function(val, oldVal) {
      if (val != oldVal && oldVal != undefined) {
        console.log("originalUrl Changed!", val, oldVal);

        let data = {
          id: this.url._id,
          delayPreview: this.url.delayPreview,
          originalUrl: this.url.originalUrl
        };

        this.$axios
          .$post(`${process.env.apiHost}/api/url/${this.url._id}/edit`, data, {
            withCredentials: true
          })
          .then(res => {
            this.editUrlMessage.success = res;
          })
          .catch(err => {
            this.editUrlMessage.error = err;
            console.log("Edit URL Fail -", err);
          });
      }
    }, 500)
  },
  methods: {},
  computed: {
    ...mapFields(["systemRoles", "authenticated", "user", "user.user.role"]),
    originalUrl() {
      if (this.url) return this.url.originalUrl;
    },
    delayPreview() {
      if (this.url) return this.url.delayPreview;
    }
  }
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

  h3 {
    margin: 0 0 20px 0;
    padding: 0 0 20px 0;
    border-bottom: 1px solid $color-grey;
  }

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
