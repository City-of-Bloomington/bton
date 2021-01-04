import Vuex from "vuex";
import axios from "axios";

import { getField, updateField } from "vuex-map-fields";

export const strict = false;

export const defaultState = () => ({
  systemRoles: JSON.parse(process.env.userRoles),
  authenticated: false,
  user: null,
  appData: null,
  appDataLogo: null,
  appDataScreenshots: [],
  consoleLog: {
    info: [
      "background: rgb(31, 90, 174)",
      "color: white",
      "display: block",
      "border-radius: 3px",
      "padding: 2px 0"
    ].join(";"),

    success: [
      "background: rgb(76, 174, 79)",
      "color: white",
      "display: block",
      "border-radius: 3px",
      "padding: 2px 0"
    ].join(";"),

    error: [
      "background: rgb(235, 59, 36)",
      "color: white",
      "display: block",
      "border-radius: 3px",
      "padding: 2px 0"
    ].join(";")
  }
});

const state = () => defaultState();

export const mutations = {
  updateField,
  RESET_BASE_STATE(state) {
    Object.assign(state, defaultState());
  },
  SET_AUTHENTICATED(state, payload) {
    state.authenticated = payload;
  },
  SET_USER(state, payload) {
    state.user = payload;
  },
  SET_APP_DATA(state, payload) {
    state.appData = payload;
  },
  SET_APP_DATA_LOGO(state, payload) {
    state.appDataLogo = payload;
  },
  SET_APP_DATA_SCREENSHOTS(state, payload) {
    state.appDataScreenshots = payload;
  },
  PUSH_NEW_APP_DATA_SCREENSHOT(state) {
    state.appDataScreenshots.push({ new: true, base64Img: "", info: {} });
  },
  PUSH_NEW_APP_DATA_SCREENSHOT_DATA(state, payload) {
    state.appDataScreenshots[payload.index] = {
      new: true,
      base64Img: payload.base64,
      info: payload.info
    };
  },
  REMOVE_NEW_APP_DATA_SCREENSHOT(state, payload) {
    state.appDataScreenshots.splice(payload, 1);
  },
  PUSH_NEW_APP_DATA_SECTION(state) {
    state.appData.sections.push({ new: true, heading: "", body: "" });
  },
  REMOVE_NEW_APP_DATA_SECTION(state, payload) {
    state.appData.sections.splice(payload, 1);
  }
};

export const actions = {
  resetBaseState({ commit }) {
    commit("RESET_BASE_STATE");
  },
  setAuthenticated(context, payload) {
    context.commit("SET_AUTHENTICATED", payload);
  },
  setAppData(context, payload) {
    context.commit("SET_APP_DATA", payload);
  },
  setAppDataLogo(context, payload) {
    context.commit("SET_APP_DATA_LOGO", payload);
  },
  setAppDataScreenshots(context, payload) {
    context.commit("SET_APP_DATA_SCREENSHOTS", payload);
  },
  pushNewAppDataScreenshot(context) {
    context.commit("PUSH_NEW_APP_DATA_SCREENSHOT");
  },
  pushNewAppDataScreenshotData(context, payload) {
    context.commit("PUSH_NEW_APP_DATA_SCREENSHOT_DATA", payload);
  },
  removeNewAppDataScreenshot(context, payload) {
    context.commit("REMOVE_NEW_APP_DATA_SCREENSHOT", payload);
  },
  pushNewAppDataSection(context) {
    context.commit("PUSH_NEW_APP_DATA_SECTION");
  },
  removeNewAppDataSection(context, payload) {
    context.commit("REMOVE_NEW_APP_DATA_SECTION", payload);
  },
  async nuxtServerInit({ commit, state, req }, { app }) {
    const cookieRes = this.$cookies.getAll();

    return axios
      .get(`${process.env.apiHost}/auth/user/`, {
        withCredentials: true,
        headers: { Cookie: `sid=${cookieRes.sid}` }
      })
      .then(res => {

        commit("SET_USER", res.data);
        commit("SET_AUTHENTICATED", res.data.isLoggedIn);

        return Promise.resolve();
      })
      .catch(err => {
        console.log("nuxtServerInit Err", err);
        return Promise.reject();
      });
  }
};

export const getters = {
  getField
};

export default {
  namespaced: true,
  modules: {},
  mutations,
  actions,
  getters,
  state
};
