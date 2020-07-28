import Vue from 'vue'

Vue.mixin({
  data() { return {} },
  computed: {},
  methods: {
    /**
     * Given a string, you'll get it back formatted
     * replacing spaces for dashes, & for and, and removing commas.
     * Helps for use with CSS, etc.
     *
     * @promise     stringToDashed
     * @param       { String } string
     * @return      { String}  The string formatted with dashes.
     * 
     */
    stringToDashed(string) {
      return string
        .replace(/\s+/g, '-')
        .replace(/,/g, '')
        .replace(/&/g, '-and-')
        .toLowerCase();
    },
  }
});