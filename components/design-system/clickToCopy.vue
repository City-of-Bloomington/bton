<template>
  <component :is="type" class="click-to-copy-wrapper">
    <input type="hidden" :id="`short-url-copy-${id}`" :value="value" />
    <button class="btn copy" @click="copyTestingCode(id, $event)">copy</button>
  </component>
</template>

<script>
/**
 * Click to Copy Button
 */
export default {
  name: "clickToCopy",
  status: "ready",
  release: "1.0.0",
  props: {
    /**
     * The html element name used copy wrapper.
     */
    type: {
      type: String,
      default: "div",
      validator: value => {
        return value.match(/(div)/);
      }
    },
    /**
     * ID Index of the css#ID to copy
     * short-url-copy-#ID
     */
    id: {
      required: true,
      type: String
    },
    /**
     * short url, URL
     */
    value: {
      required: true,
      type: String
    }
  },
  methods: {
    copyTestingCode(id, e) {
      e.preventDefault();

      let codeToCopy = document.querySelector(`#short-url-copy-${id}`);
      codeToCopy.setAttribute("type", "text");
      codeToCopy.select();

      try {
        let successful = document.execCommand("copy");
        alert(
          `Short URL copied:\n ${JSON.parse(JSON.stringify(codeToCopy._value))}`
        );
      } catch (err) {
        alert("Oops, unable to copy.");
      }

      codeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    }
  }
};
</script>

<style lang="scss">
.btn {
  &.copy {
    position: relative;
    margin: 0;
    padding: 0 35px 0 10px;

    &:after {
      content: "";
      position: absolute;
      top: 5px;
      right: 10px;
      width: 15px;
      height: 15px;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' data-prefix='far' data-icon='copy' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' class='svg-inline--fa fa-copy fa-w-14 fa-3x'%3E%3Cpath fill='white' d='M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z' class=''%3E%3C/path%3E%3C/svg%3E");
    }
  }
}
</style>
