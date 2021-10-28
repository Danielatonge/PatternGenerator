import Vue from "vue";
import Vuex from "vuex";
import * as api from '@/service';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    patterns: [],
    pattern: {},
    selected_patterns: [],
    pagination: 10,
    numFound: 0,
  },
  mutations: {
    SET_PATTERNS(state, patterns) {
      state.patterns = patterns;
    },
    ADD_PATTERN(state, pattern) {
      state.patterns.push(pattern);
    },
    ADD_TO_SELECTED_PATTERNS(state, pattern) {
      state.selected_patterns.push(pattern);
    },
    REMOVE_FROM_SELECTED_PATTERNS(state, pattern) {
      state.selected_patterns = state.selected_patterns.filter(
        (x) => x.id !== pattern.id
      );
    },
    SET_PAGINATION(state, plength) {
      state.pagination = plength;
    },
    SET_NUMFOUND(state, numFound) {
      state.numFound = numFound;
    },
  },
  actions: {
    getPatterns({ commit }, filters) {
      return api
        .getPatterns(filters)
        .then((response) => {
          const res = response.data;
          commit("SET_PATTERNS", res.content);
          commit("SET_PAGINATION", res.totalPages);
          commit("SET_NUMFOUND", res.totalElements);
          return {
            paginationLength: res.totalPages,
            numFound: res.totalElements,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToSelectedPatterns({ commit }, pattern) {
      commit("ADD_TO_SELECTED_PATTERNS", pattern);
    },
    removeFromSelectedPatterns({ commit }, pattern) {
      commit("REMOVE_FROM_SELECTED_PATTERNS", pattern);
    },
  },
  modules: {},
});
