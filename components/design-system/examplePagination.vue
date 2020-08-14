<template>
  <component :is="type" class="pagination">
    <a
      @click.prevent="firstPage"
      :disabled="firstPageActive"
      aria-label="Go to first page"
      class="first"
    >First</a>

    <a
      @click.prevent="previousPage"
      :disabled="firstPageActive"
      aria-label="Go to previous page"
      class="previous"
    >Previous</a>

    <template v-for="page in pages">
      <a
        @click.prevent="pageNumber(page)"
        :disabled="page.isDisabled"
        :class="{ active: isPageActive(page.number) }"
        :aria-label="`Go to page number ${page.number}`"
      >{{ page.number }}</a>
    </template>

    <a
      @click.prevent="nextPage"
      :disabled="lastPageActive"
      aria-label="Go to next page"
      class="next"
    >Next</a>

    <a
      @click.prevent="lastPage"
      :disabled="lastPageActive"
      aria-label="Go to last page"
      class="last"
    >Last</a>
  </component>
</template>

<script>
export default {
  name: "examplePagination",
  status: "ready",
  release: "1.0.0",
  props: {
    type: {
      type: String,
      default: "nav",
      validator: (value) => {
        return value.match(/(nav)/);
      },
    },
    total: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    startPage() {
      if (this.currentPage === 1) {
        return 1;
      }

      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons + 1;
      }

      return this.currentPage - 1;
    },
    endPage() {
      return Math.min(
        this.startPage + this.maxVisibleButtons - 1,
        this.totalPages
      );
    },
    maxVisibleButtons() {
      return this.totalPages;
    },
    pages() {
      const range = [];

      for (let i = this.startPage; i <= this.endPage; i += 1) {
        range.push({
          number: i,
          isDisabled: i === this.currentPage,
        });
      }

      return range;
    },
    firstPageActive() {
      return this.currentPage === 1;
    },
    lastPageActive() {
      return this.currentPage === this.totalPages;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  methods: {
    firstPage() {
      if (!this.firstPageActive) this.$emit("pagechanged", 1);
    },
    previousPage() {
      if (!this.firstPageActive)
        this.$emit("pagechanged", this.currentPage - 1);
    },
    pageNumber(page) {
      if (!page.isDisabled) this.$emit("pagechanged", page.number);
    },
    nextPage() {
      if (!this.lastPageActive) this.$emit("pagechanged", this.currentPage + 1);
    },
    lastPage() {
      if (!this.lastPageActive) this.$emit("pagechanged", this.totalPages);
    },
    isPageActive(page) {
      return this.currentPage === page;
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  &.pagination {
    margin: 20px 0 0 0;
    padding: 0;

    a {
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;

      &.active {
        background-color: $color-blue;
        color: white;
      }

      &[disabled] {
        cursor: not-allowed;
        // pointer-events: none;
      }
    }
  }
}
</style>