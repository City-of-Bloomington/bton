<template>
  <div>
    <example-header
      :logo="{
        url:          `${cityWebsiteUrl}`,
        image:        `${headerLogo}`,
        imageAlt:     `${cityName}`
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
        >Login</a>

        <fn1-dropdown
          v-if="authenticated"
          slot="dropdown"
          text="Menu"
          navAlign="right"
          :navItems="[
          { name:       'Feedback',
          href:       `${cityWebsiteUrl}/ureport/miscellaneous/53`,
          target:     '_blank' },
          {name: 'Settings',  href: `${client}/settings/`},
          {name: 'Logout',    href: `${api}/auth/logout/`},
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
      default: false,
    },
  },
  components: { exampleHeader },
  data() {
    return {
      appName: process.env.APP_NAME,
      client: process.env.clientHost,
      api: process.env.apiHost,
      cityWebsiteUrl: process.env.CITY_WEBSITE_URL,
      cityName: process.env.CITY_NAME,
      headerLogo: require("../assets/images/cob-logo-horizontal.svg"),
      logoHeading: process.env.LOGO_HEADING,
      logoSubHeading: process.env.LOGO_SUB_HEADING,
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
          name: `${this.appName}`,
          url: `/`,
        };
      } else {
        url = {
          name: `${this.appName}`,
        };
      }
      return url;
    },
  },
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