<template>
  <main>
    <h3 v-if="!error && data">
      Edit Url Code:
      {{ data.urlCode }}
    </h3>

    <fn1-alert
      v-if="editUrlMessage.error || editUrlMessage.success || error"
      :variant="{
        warning: editUrlMessage.error || error,
        success: editUrlMessage.success
      }"
    >
      <template v-if="editUrlMessage.error">
        {{ editUrlMessage.error }}
      </template>

      <template v-if="error">
        {{ error }}
      </template>

      <template v-if="editUrlMessage.success">
        Saved: {{ editUrlMessage.success.saved }}
      </template>
    </fn1-alert>

    <form v-if="data">
      <div class="field-group checkbox">
        <label for="delayPreview">Delay (5s) &amp; go-to Url Preview</label>
        <input
          type="checkbox"
          id="delayPreview"
          name="delayPreview"
          v-model="data.delayPreview"
        />
      </div>

      <div class="field-group">
        <label for="created-date">Created Date</label>
        <input
          disabled="disabled"
          v-model="data.createdDate"
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
          v-model="data.updatedDate"
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
          v-model="data.owner"
          autocomplete="off"
          id="url-owner"
          type="text"
          name="url-owner"
        />
      </div>

      <div class="field-group">
        <label for="original-url">Original Url</label>
        <input
          v-model="data.originalUrl"
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
          v-model="data.urlCode"
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
import axios from "axios";

export default {
  asyncData({ params }) {
    return axios
      .get(`${process.env.apiHost}/api/url/short/${params.id}`, {
        withCredentials: true
      })
      .then(res => {
        return { data: res.data[0] };
      })
      .catch(err => {
        return { error: err };
      });
  },
  mounted() {},
  components: {},
  middleware: "authenticated",
  data() {
    return {
      data: null,
      error: null,
      editUrlMessage: {
        success: null,
        error: null
      }
    };
  },
  watch: {
    originalUrl: debounce(function(val, oldVal) {
      if (val != oldVal && oldVal != undefined) {
        this.editUrlMessage = {
          success: null,
          error: null
        };

        let data = {
          id: this.data._id,
          delayPreview: this.data.delayPreview,
          originalUrl: this.data.originalUrl
        };

        this.$axios
          .$post(`${process.env.apiHost}/api/url/${this.data._id}/edit`, data, {
            withCredentials: true
          })
          .then(res => {
            this.editUrlMessage.success = res;
            this.editSuccessMessage;
          })
          .catch(err => {
            this.editUrlMessage.error = err;
            this.editFailMessage;
          });
      }
    }, 500),
    delayPreview: debounce(function(val, oldVal) {
      if (val != oldVal && oldVal != undefined) {
        this.editUrlMessage = {
          success: null,
          error: null
        };

        let data = {
          id: this.data._id,
          delayPreview: this.data.delayPreview,
          originalUrl: this.data.originalUrl
        };

        this.$axios
          .$post(`${process.env.apiHost}/api/url/${this.data._id}/edit`, data, {
            withCredentials: true
          })
          .then(res => {
            this.editUrlMessage.success = res;
            this.editSuccessMessage;
          })
          .catch(err => {
            this.editUrlMessage.error = err;
            this.editFailMessage;
          });
      }
    }, 500)
  },
  methods: {},
  computed: {
    ...mapFields(["systemRoles", "authenticated", "user", "user.user.role"]),
    originalUrl() {
      if (this.data) return this.data.originalUrl;
    },
    delayPreview() {
      if (this.data) return this.data.delayPreview;
    },
    editSuccessMessage() {
      if (this.editUrlMessage) {
        if (this.editUrlMessage.success != null) {
          setTimeout(() => {
            this.editUrlMessage.success = null;
          }, 5000);
        }
      }
    },
    editFailMessage() {
      if (this.editUrlMessage) {
        if (this.editUrlMessage.error != null) {
          setTimeout(() => {
            this.editUrlMessage.error = null;
          }, 5000);
        }
      }
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
