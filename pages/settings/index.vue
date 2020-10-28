<template>
  <div>
    <main>
      <div class="row title">
        <ul class="user-meta">
          <li v-if="dateCreated">
            <strong>Created On:</strong>
            {{ formatDate(dateCreated) }}
          </li>

          <li v-if="lastLoginDate">
            <strong>Last Login:</strong>
            {{ formatDate(lastLoginDate) }}
          </li>
        </ul>

        <form @submit.prevent>
          <div class="field-group select" v-if="role">
            <label for="user-role">Role:</label>
            <select
              disabled="disabled"
              v-model="role"
              name="Role"
              id="user-role"
            >
              <option
                v-for="(r, i) in userRoles"
                :key="r"
                :value="r"
                v-html="r"
              />
            </select>
          </div>

          <div class="field-group" v-if="username">
            <label for="username">Username:</label>
            <input
              disabled
              v-model="username"
              type="text"
              id="username"
              name="Username"
            />
          </div>

          <div class="field-group" v-if="email">
            <label for="username">Email:</label>
            <input
              disabled
              v-model="email"
              type="text"
              id="username"
              name="Username"
            />
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: "authenticated",
  data() {
    return {};
  },
  computed: {
    ...mapFields([
      "user",
      "user.user.role",
      "user.user.email",
      "user.user.username",
      "user.user.dateCreated",
      "user.user.lastLoginDate"
    ]),
    userRoles() {
      return JSON.parse(process.env.USER_ROLES);
    }
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
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  z-index: 0;
  position: relative;
  top: 120px;
  width: calc(100% - 40px);
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: $radius-default;

  .row {
    margin: 0 auto;
  }

  ul {
    &.user-meta {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid $color-grey;
      list-style: none;
      margin: 0 0 10px 0;
      padding: 0 0 10px 0;

      li {
        color: lighten($text-color, 10%);
        margin: 0;

        strong {
          color: lighten($text-color, 10%);
        }
      }
    }
  }
}
</style>
