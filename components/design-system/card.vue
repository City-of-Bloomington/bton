<template>
  <component is="div" :class="['card', layout]">
    <template v-if="layout == 'big'">
      <span v-html="title"></span>

      <div class="text">
        <p v-html="description"></p>
        <nuxt-link :to="link">Find out more</nuxt-link>
      </div>
    </template>

    <template v-else-if="layout == 'small'">
      <img :src="thumbnail" :alt="title" />
      <div class="text">
        <h3 v-html="title"></h3>
        <p v-html="description"></p>
      </div>
    </template>
  </component>
</template>

<style lang="scss" scoped>
.card {
  background: white;

  &.default {}

  &.big {
    border: $border-default;

    span {
      display: block;
      background: $color-blue;
      font-size: 18px;
      line-height: 18px;
      color: white;
      padding: 8px 20px;
    }

    .text {
      padding: 10px 20px;

      p {
        color: $text-color;
        font-size: 16px;
        margin: 0 0 10px 0;
      }

      a {
        color: $color-blue;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.25px;

        &:hover,
        &:focus {
          text-decoration: underline;
        }
      }
    }
  }

  &.small {
    position: relative;
    padding: 10px;
    display: flex;
    align-items: center;
    height: 80px;
    margin: 0 0 20px 0;
    // border: $border-default;

    img {
      // position: absolute;
      // top: 5px;
      // left: 10px;
      width: 60px;
      height: 60px;
    }

    .text {
      // background: green;
      margin: 0 0 0 auto;
      width: calc(100% - 75px);

      h3 {
        color: $text-color;
        font-size: 16px;
        line-height: 16px;
        font-weight: 600;
        letter-spacing: 0.25px;
        margin: 0 0 5px 0;
      }

      p {
        color: $text-color;
        font-size: 14px;
        line-height: 16px;
        margin: 0 0 10px 0;
      }

      a {
        color: $color-blue;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.25px;

        &:hover,
        &:focus {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>

<script>
/**
 * Use for cards.
 */
export default {
  name: "example-card",
  status: "ready",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the card.
     */
    type: {
      type: String,
      default: "a",
      validator: value => {
        return value.match(/(a)/)
      },
    },
    /**
     * Card layout style
     */
    layout: {
      type:    String,
      default: 'default',
    },
    /**
     * Card title
     */
    title: {
      type:    String,
      default: '',
    },
    /**
     * Card description
     */
    description: {
      type:    String,
      default: '',
    },
    /**
     * Card Link
     */
    link: {
      type:    String,
      default: '',
    },
    /** 
     * Card Thumbnail (small cards only)
     */
    thumbnail: {
      type:    String,
      default: require('../../assets/images/city-of-bloomington-logo.svg')
    }
  },
}
</script>