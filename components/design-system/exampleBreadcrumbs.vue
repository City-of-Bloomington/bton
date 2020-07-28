<template>
  <component :is="type" class="breadcrumbs">
    <a href="/" title="Home">
      <span>Home</span>
    </a>

    <nuxt-link
      v-for="(item, index) in navItems"
      :key="index"
      :to="{ path: item.href }"
      :title="item.name"
      :class="{ active: localActive === item.component }">
      <span v-html="item.name"></span>
    </nuxt-link>
  </component>
</template>

<script>
/**
 * Used as main page navigation in templates.
 */
export default {
  name: "example-breadcrumbs",
  status: "ready",
  release: "1.0.0",
  model: {
    prop: "active",
  },
  props: {
    /**
     * The html element name used for the nav bar.
     */
    type: {
      type: String,
      default: "nav",
      validator: value => {
        return value.match(/(nav)/)
      },
    },
    /**
     * State which tab is active when initiated (using name of the component).
     */
    active: {
      required: true,
      type: String,
    },
    /**
     * Menu items to be displayed on the nav bar.
     */
    navItems: {
      required: true,
      type: Array,
    },
  },
  computed: {
    localActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit("input", val)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    color: lighten($text-color, 25%);
    // color: $text-color;
    font-size: $size-m;
    font-family: $font-text;
    line-height: 20px;
    text-decoration: none;
    margin: 0 20px 0 0;

    &:first-of-type {
      position: relative;
      margin: 0 10px 0 0;
      height: 20px;
      width: 20px;
      background-size: 20px 20px;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='home' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' class='svg-inline--fa fa-home fa-w-18 fa-3x'%3E%3Cpath fill='%234f4f4f' d='M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z' class=''%3E%3C/path%3E%3C/svg%3E");

      &:after {
        display: none;
      }

      span {
        @include visually-hidden;
      }
    }
    
    &:not(:last-child):after {
      content: "";
      position: absolute;
      right: -22px;
      height: 15px;
      width: 15px;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='caret-right' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 512' class='svg-inline--fa fa-caret-right fa-w-6 fa-3x'%3E%3Cpath fill='%238f8f8f' d='M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z' class=''%3E%3C/path%3E%3C/svg%3E");
    }
    
    &.active {
      color: $text-color;
    }
  }
}
</style>