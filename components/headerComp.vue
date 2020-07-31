<template>
  <div>
    <example-header
      :logo="{
        url:          `${cityWebsiteUrl}`,
        image:        `${headerLogo}`,
        imageAlt:     `${cityName}`
      }"
      :application="{
        name:         `${appName}`,
        url:          `/`
      }"
      :navItems="[
        { name:       'Feedback',
          href:       `${cityWebsiteUrl}/ureport/miscellaneous/53`,
          target:     '_blank' },
        { name:       'URLs',
          href:       `/urls`}
      ]"
    >
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
          {name: 'Settings',  href: `${client}/settings/`},
          {name: 'Logout',    href: `${api}/auth/logout/`},
        ]"
      />
    </example-header>
  </div>
</template>

<script>
import exampleHeader from "~/components/design-system/exampleHeader.vue";
import { mapFields } from "vuex-map-fields";

export default {
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