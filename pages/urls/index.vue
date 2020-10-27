<template>
  <main>
    <div class="auto-suggest-wrapper">
      <form @submit.prevent @keyup.enter="searchEntered()">
        <label for="address-search" class="sr-only">Address Search</label>
        <exampleSearch
          v-model="addressSearchAuto"
          v-on:focusd="sFocus()"
          v-on:blurd="sBlur()"
          placeholder="Search Originals"
          ref="addressSearch"
          name="address-search"
          id="address-search"
        />
      </form>
    </div>

    <div class="search-results" v-if="addressSearchAutoRes && searchHasFocus">
      <table>
        <thead>
          <tr>
            <!-- <th>Hits</th> -->
            <th>Originals</th>
            <th>Shorts</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(r, i) in addressSearchAutoRes" :key="r._id">
            <!-- <td>{{ r.hits }}</td> -->
            <td>{{ r.originalUrl }}</td>
            <td>{{ r.shortUrl }}</td>
            <td class="button-row">
              <clickToCopy :id="i" :value="r.shortUrl" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <fn1-tabs v-if="urls && !searchHasFocus">
      <fn1-tab name="Your Urls" :selected="true">
        <table v-if="usersUrls.length" class="users-urls">
          <thead>
            <tr>
              <!-- <th>Hits</th> -->
              <th>Delay</th>
              <th>Originals</th>
              <th>Shorts</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(u, i) in usersUrls" :key="u._id">
              <!-- <td>{{ u.hits }}</td> -->
              <td>
                <div>
                  <input
                    disabled="disabled"
                    type="checkbox"
                    id="delayPreview"
                    name="delayPreview"
                    v-model="u.delayPreview"
                  />
                  <label for="delayPreview" class="sr-only">Delay</label>
                </div>
              </td>
              <td>{{ u.originalUrl }}</td>
              <td>{{ u.shortUrl }}</td>
              <td class="button-row">
                <clickToCopy :id="i" :value="u.shortUrl" />
                <button
                  class="button qr"
                  @click="openModal('QRCodeModal', i, {shortUrl: u.shortUrl})">QR</button>
                <nuxt-link
                  class="button"
                  :to="{ name: 'urls-id', params: { id: u.urlCode } }"
                  >Edit</nuxt-link
                >

                <div class="modal-mask"
                     ref="QRCodeModal"
                     :qrCodeModal.showQRModal="false"
                     v-show="false">
                  <div class="modal-wrapper">
                    <div
                      class="modal-container"
                      :style="[ qrCodeModal.qrModalOptions.color.dark ? { 'background': qrCodeModal.qrModalOptions.color.dark.hex } : '#4f4f4f' ]">
                      <div class="modal-header">
                        <h4>QR Code {{ i }} </h4>
                      </div>

                      <div class="modal-body">
              
                        <div class="canvas-wrapper">
                          <canvas :id="`canvas-${i}`"></canvas>

                          <aside>
                            <button @click="changeQRColor('light')">Light</button>
                            <button @click="changeQRColor('dark')">Dark</button>
                            <button @click="changeQRColor('blue')">Blue</button>

                            <div
                              class="colorpicker-wrapper" ref="colorpickerWrapper">

                              <input
                                type="text"
                                class="colorpicker-picker-input"
                                @focus="displayColorPicker(true, i)"
                                :placeholder="qrCodeModal.qrModalOptions.pickerColorsDark.hex">
                                
                              <chrome-picker
                                class="colorpicker-picker"
                                v-if="showColorPicker"
                                v-model="qrCodeModal.qrModalOptions.pickerColorsDark" />
                            </div>
                          </aside>
                        </div>
                      </div>

                      <div class="modal-footer">
                        <a
                          ref="qrDownloadRef"
                          class="button"
                          @click="downloadQRCode(u.shortUrl, i)">Download</a>

                        <button
                          class="button"
                          @click="closeModal('QRCodeModal', i)">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else><strong>Sorry,</strong> you don't have any URLs yet.</p>
      </fn1-tab>

      <fn1-tab name="All Urls">
        <table v-if="urls.length" class="all-urls">
          <thead>
            <tr>
              <!-- <th>Hits</th> -->
              <th>Originals</th>
              <th>Shorts</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(u, i) in urls" :key="u._id">
              <!-- <td>{{ u.hits }}</td> -->
              <td>{{ u.originalUrl }}</td>
              <td>{{ u.shortUrl }}</td>
              <td class="button-row">
                <clickToCopy :id="i" :value="u.shortUrl" />
                <nuxt-link
                  v-if="role == systemRoles.admin"
                  class="button"
                  :to="{ name: 'urls-id', params: { id: u.urlCode } }"
                  >Edit</nuxt-link
                >
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else><strong>Sorry,</strong> the system looks empty.</p>
      </fn1-tab>

      <fn1-tab
        :name="`${passlistTerm} Urls`"
        class="whitelisted"
        v-if="role == systemRoles.admin"
      >
        <header>
          <fn1-badge>Role Required: {{ systemRoles.admin }}</fn1-badge>
          <p>
            {{ passlistTerm }} Urls are those allowed by the system to be
            accepted when creating a new short Url.
          </p>
        </header>

        <fn1-alert
          v-if="
            createWhiteListUrlMessage.error || createWhiteListUrlMessage.success
          "
          :variant="{
            warning: createWhiteListUrlMessage.error,
            success: createWhiteListUrlMessage.success
          }"
        >
          <template v-if="createWhiteListUrlMessage.error">
            {{ createWhiteListUrlMessage.error }}
          </template>

          <template v-if="createWhiteListUrlMessage.success">
            {{ createWhiteListUrlMessage.success.shortUrl }}
            <clickToCopy
              :id="0"
              :value="createWhiteListUrlMessage.success.shortUrl"
            />
          </template>
        </fn1-alert>

        <form @submit.prevent>
          <div class="field-group inline">
            <label for="whitelist-url">{{ passlistTerm }} Url</label>

            <input
              type="text"
              v-model="whitelistedURLValue"
              label="New Whitelist Url"
              placeholder="eg: https://bloomington.in.gov"
              name="whitelist-url"
              id="whitelist-url"
            />

            <input
              type="submit"
              value="Create"
              @click="postNewWhitelistUrl()"
            />
          </div>
        </form>

        <table v-if="whitelistedUrls" class="passlist-urls">
          <thead>
            <tr>
              <th>Accepted Urls</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(u, i) in whitelistedUrls" :key="u._id">
              <td>{{ u.url }}</td>
              <td>
                <button @click="deleteWhitelistUrl(u._id)">delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </fn1-tab>
    </fn1-tabs>
  </main>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import exampleSearch from "~/components/design-system/exampleSearch";
import clickToCopy from "~/components/design-system/clickToCopy.vue";
import modal     from '~/components/design-system/modal.vue';
import QRCode from 'qrcode';
import { Chrome } from 'vue-color';
import ClickOutside from 'vue-click-outside'
import debounce from "lodash.debounce";

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getNewWhitelistUrl();

      vm.$axios
        .$get(
          `${process.env.apiHost}/api/urls?limit=${vm.limit}&skip=${vm.skip}`,
          {
            withCredentials: true
          }
        )
        .then(res => {
          vm.urls = res.urlRes;
          vm.totalUrls = res.total;
        })
        .catch(err => {
          console.log("Get URLs Fail -", err);
        });
    });
  },
  mounted() {},
  components: { exampleSearch, clickToCopy, modal, 'chrome-picker': Chrome, },
  directives: {
    ClickOutside
  },
  middleware: "authenticated",
  data() {
    return {
      totalUrls: null,
      limit: 10000,
      skip: 0,
      urls: null,
      addressSearchAuto: null,
      addressSearchAutoRes: null,
      searchHasFocus: false,
      whitelistedURLValue: null,
      whitelistedUrls: null,
      createWhiteListUrlMessage: {
        success: null,
        error: null
      },
      showColorPicker: false,
      qrCodeModal: {
        shortUrl: null,
        index: null,
        showQRModal:       false,
        qrModalOptions: {
          errorCorrectionLevel: 'H',
          margin: 0,
          color: {
            dark: '#4f4f4f',
            light: '#0000',
          },
          pickerColorsDark: {},
        },
      },
    };
  },
  watch: {
    'qrCodeModal.qrModalOptions.pickerColorsDark.hex': function(val, oldVal) {
      if(val != oldVal) {
        this.qrCodeModal.qrModalOptions.color.dark = val;

        this.qrCodeDisplay(this.qrCodeModal.shortUrl, this.qrCodeModal.index, this.qrCodeModal.qrModalOptions);
      }
    },
    addressSearchAuto: debounce(function(val, oldVal) {
      if (this.addressSearchAuto) {
        this.$axios
          .$get(`${process.env.apiHost}/api/url/${this.addressSearchAuto}`, {
            withCredentials: true
          })
          .then(res => {
            this.addressSearchAutoRes = res;
          })
          .catch(err => {
            console.log("Get URL Fail -", err);
          });
      } else {
        this.autoSuggestRes = null;
      }
    }, 500)
  },
  methods: {
    sFocus() {
      this.searchHasFocus = true;
    },
    sBlur() {
      setTimeout(() => {
        this.searchHasFocus = false;
      }, 200);
    },
    deleteURL(id) {
      this.$axios
        .$delete(`${process.env.apiHost}/api/short/${id}`, {
          withCredentials: true
        })
        .then(res => {
          console.log("rm", res);
        })
        .catch(err => {
          console.log("rm fail", err);
        });
    },
    postNewWhitelistUrl() {
      let url = this.stripTrailingSlash(this.whitelistedURLValue);

      this.$axios
        .$post(
          `${process.env.apiHost}/api/url/whitelist`,
          { url: url },
          {
            withCredentials: true
          }
        )
        .then(res => {
          console.log("postNewWhitelistUrl res", res);
          this.createWhiteListUrlMessage.success = res.data;
          this.getNewWhitelistUrl();
        })
        .catch(err => {
          this.createWhiteListUrlMessage.error = err.response.data;
          console.log("postNewWhitelistUrl fail", err);
        });
    },
    getNewWhitelistUrl() {
      this.$axios
        .$get(`${process.env.apiHost}/api/urls/whitelist`, {
          withCredentials: true
        })
        .then(res => {
          this.whitelistedUrls = res.urlRes;
          console.log("getNewWhitelistUrl res", res.urlRes);
        })
        .catch(err => {
          console.log("getNewWhitelistUrl fail", err);
        });
    },
    deleteWhitelistUrl(id) {
      this.$axios
        .$delete(`${process.env.apiHost}/api/urls/whitelist/delete/${id}`, {
          withCredentials: true
        })
        .then(res => {
          console.log("deleteWhitelistUrl res", res);
          this.getNewWhitelistUrl();
        })
        .catch(err => {
          console.log("deleteWhitelistUrl fail", err);
        });
    },
    displayColorPicker(bool, index) {
      console.log('display it index', index)
      if(bool) {
        this.showColorPicker = true;
        document.addEventListener('click', this.documentClick);
      } else {
        this.hide();
      }
    },
    changeQRColor(color) {
      switch(color) {
        case 'dark':
          this.qrCodeModal.qrModalOptions.color.dark = '#4f4f4f';
          this.qrCodeModal.qrModalOptions.pickerColorsDark.hex = '#4f4f4f';

          this.qrCodeDisplay(this.qrCodeModal.shortUrl, this.qrCodeModal.index, this.qrCodeModal.qrModalOptions);
          break;
        case 'light':
          this.qrCodeModal.qrModalOptions.color.dark = '#ffffff';
          this.qrCodeModal.qrModalOptions.pickerColorsDark.hex = '#ffffff';

          this.qrCodeDisplay(this.qrCodeModal.shortUrl, this.qrCodeModal.index, this.qrCodeModal.qrModalOptions);
          break;
        case 'blue':
          this.qrCodeModal.qrModalOptions.color.dark = '#1e5aae';
          this.qrCodeModal.qrModalOptions.pickerColorsDark.hex = '#1e5aae';

          this.qrCodeDisplay(this.qrCodeModal.shortUrl, this.qrCodeModal.index, this.qrCodeModal.qrModalOptions);
          break;
        default:
          alert('default color')
      }
    },
    hide() {
      // this.showColorPicker = false;
      document.removeEventListener('click', this.documentClick);
      this.showColorPicker = false;
    },
    documentClick(e) {

      let colorPicker = document.querySelector('.colorpicker-picker'),
      colorPickerInput = document.querySelector('.colorpicker-picker-input');

      if(!colorPicker.contains(e.target) && !colorPickerInput.contains(e.target))  this.hide();

		},
    qrCodeDisplay(shortUrl, i, options) {

      this.qrCodeModal.shortUrl = shortUrl;
      this.qrCodeModal.index = i;

      let canvasElm = document.getElementById(`canvas-${i}`);

      QRCode.toCanvas(canvasElm, shortUrl, options, (err, canvas) => {
        if (err) console.log('QRCode err', err)
      });

      // if(this.showColorPicker) this.showColorPicker = false;
    },
    downloadQRCode(shortUrl, i) {
      let canvasElm = document.getElementById(`canvas-${i}`),
              image = canvasElm.toDataURL("image/jpg"),
                  a = document.createElement("a");
             a.href = image;
         a.download = shortUrl;
            a.click();
    },
    openModal(modalRef, i, option) {
      if(modalRef === 'QRCodeModal'){
        this.$refs.QRCodeModal[i].style.display = "flex";
        this.qrCodeDisplay(option.shortUrl, i, this.qrCodeModal.qrModalOptions)
      }
    },
    closeModal(modalRef, i) {
      if(modalRef === 'QRCodeModal'){
        this.$refs.QRCodeModal[i].style.display = "none";
        this.qrCodeModal.shortUrl = null;
        this.qrCodeModal.index = null;
      }
    },
  },
  computed: {
    ...mapFields(["systemRoles", "authenticated", "user", "user.user.role"]),
    usersUrls() {
      return this.urls.filter(url => url.owner === this.user.user.username);
    },
    passlistTerm() {
      return process.env.passListTerm;
    },
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

  .colorpicker-wrapper {
    position: relative;

    input {
      border: 1px solid $color-grey;
      border-radius: $radius-default;
      padding: 2px 5px;

      &::placeholder {
        letter-spacing: .5px;
        color: $text-color;
      }
    }
    
    .vc-chrome {
      position: absolute;
      bottom: -120px;
      right: -160px;
    }
  }

  .modal-container {
    width: 420px;
  }

  .modal-body {
    display: flex;
    overflow: visible !important;
  }

  table {
    color: $text-color;

    &.users-urls {
      table-layout: fixed;

      th,
      td {
        &:first-child {
          width: 50px;
        }

        &:nth-child(2) {
          // width: 55px;
        }

        &:nth-child(3),
        &:nth-child(4) {
          max-width: 275px;
        }
      }
    }

    td {
      word-wrap: break-word;

      &.button-row {
        width: 100%;
        display: flex;
        padding: 8px 0 8px 8px;
        justify-content: flex-end;

        .button {
          margin: 0;

          &:nth-child(1n) {
            margin: 0 0 0 5px;
          }
        }
      }
    }
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
