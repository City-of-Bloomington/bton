<template>
  <div>
    <example-header
      :logo="{
        url: `${cobSiteUrl}`,
        image: `${headerLogo}`,
        imageAlt: `${nameOfCity}`
      }"
      :application="showAppUrl"
      :navItems="[showHeaderUrls]"
    >
      <template v-if="!redirect">
        <a
          v-if="!authenticated"
          slot="dropdown"
          :href="`${api}/auth/login/`"
          class="button auth"
          >Login</a
        >

        <fn1-dropdown
          v-if="authenticated"
          slot="dropdown"
          text="Menu"
          navAlign="right"
          :navItems="[
            {
              name: `Feedback`,
              href: `${cobSiteUrl}/ureport/miscellaneous/53`,
              target: '_blank'
            },
            { name: 'Settings', href: `${client}/settings/` },
            { name: 'Logout', href: `${api}/auth/logout/` }
          ]"
        />
      </template>
    </example-header>
  </div>
</template>

<script>
import exampleHeader from "~/components/design-system/exampleHeader.vue";
import { mapFields } from "vuex-map-fields";

export default {
  props: {
    redirect: {
      type: Boolean,
      default: false
    }
  },
  components: { exampleHeader },
  data() {
    return {
      headerLogo: require("../assets/images/cob-logo-horizontal.svg")
    };
  },
  computed: {
    ...mapFields(["authenticated"]),
    showHeaderUrls() {
      let urls;

      if (!this.redirect) {
        urls = { name: "URLs", href: `/urls` };
      } else {
        urls = {};
      }
      return urls;
    },
    showAppUrl() {
      let url;

      if (!this.redirect) {
        url = {
          name: `${process.env.appName}`,
          url: `/`
        };
      } else {
        url = {
          name: `${process.env.appName}`
        };
      }
      return url;
    },
    cobSiteUrl() {
      return process.env.cobWebsiteURL;
    },
    nameOfCity() {
      return process.env.cityName;
    },
    api() {
      return process.env.apiHost;
    },
    client() {
      return process.env.clientHost;
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  z-index: 10;
  border-bottom: $border-default;

  .auth {
    padding: 5px 10px;
  }
}
</style>
