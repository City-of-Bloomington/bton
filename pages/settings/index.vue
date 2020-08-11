<template>
  <div>
    <main>
      <div class="row title">
        <ul class="user-meta">
          <li>
            <strong>Created On:</strong>
            {{ formatDate(userData.dateCreated) }}
          </li>

          <li>
            <strong>Last Login:</strong>
            {{ formatDate(userData.lastLoginDate) }}
          </li>
        </ul>

        <form @submit.prevent>
          <div class="field-group select">
            <label for="user-role">Role:</label>
            <select
              :disabled="userDataClone.role !== 'admin'"
              v-model="userData.role"
              name="Role"
              id="user-role"
            >
              <option v-for="r, i in roles" :key="r" :value="r" v-html="r" />
            </select>
          </div>

          <div class="field-group">
            <label for="username">Username:</label>
            <input disabled v-model="userData.username" type="text" id="username" name="Username" />
          </div>

          <div class="field-group">
            <label for="username">Email:</label>
            <input disabled v-model="userEmail" type="text" id="username" name="Username" />
          </div>

          <footer v-if="userDataClone.role == 'admin'">
            <button @click.prevent="postUser(userData)">Save</button>

            <button @click.prevent="postUserCancel()">Cancel</button>
          </footer>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  asyncData({ $axios }) {
    return $axios.$get(`${process.env.apiHost}/auth/user`).then((res) => {
      return { userData: res.user, userDataClone: { ...res.user } };
    });
  },
  middleware: "authenticated",
  data() {
    return {
      userEmailDomain: "@bloomington.in.gov",
      roles: ["admin", "default"],
    };
  },
  computed: {
    userEmail() {
      return this.userData.username + this.userEmailDomain;
    },
  },
  methods: {
    formatDate(date) {
      let d = new Date(date);

      let year = d.getFullYear(),
        month = d.getMonth() + 1,
        dt = d.getDate(),
        hours = d.getHours(),
        mins = d.getMinutes(),
        ampm = hours >= 12 ? "pm" : "am";

      hours = hours % 12;
      hours = hours ? hours : 12; // set hour 0 = 12
      mins = mins < 10 ? "0" + mins : mins;

      if (dt < 10) {
        dt = "0" + dt;
      }
      if (month < 10) {
        month = "0" + month;
      }

      let strTime = hours + ":" + mins + " " + ampm,
        formatedDate = `${month}/${dt}/${year} - ${strTime}`;

      return formatedDate;
    },
    postUser(data) {
      data.ogUser = this.userDataClone.user;

      this.$axios
        .post(`${process.env.apiHost}/auth/user/`, data, {
          withCredentials: true,
        })
        .then((res) => {
          this.userData, (this.userDataClone = res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postUserCancel() {
      this.userData = this.userDataClone;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  z-index: 0;
  position: relative;
  background: white;
  top: 150px;
  padding: 20px;
  width: 720px;
  margin: 0 auto;

  ul {
    &.user-meta {
      display: flex;
      border-bottom: 1px solid $color-grey;
      list-style: none;
      margin: 0 0 15px 0;
      padding: 0 0 15px 0;

      li {
        color: lighten($text-color, 10%);
        margin: 0 20px 0 0;

        strong {
          color: lighten($text-color, 10%);
        }
      }
    }
  }

  form {
    &:hover {
      box-shadow: none;
    }

    footer {
      button {
        &:last-of-type {
          background: transparent;
          color: lighten($text-color, 20%);
          font-weight: 600;
          text-decoration: none;

          &:hover,
          &:focus {
            color: $text-color;
          }
        }
      }
    }
  }
}
</style>