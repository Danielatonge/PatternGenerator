<template>
  <div class="grey lighten-4">
    <v-container class="pt-8 pb-0">
      <div class="pb-16">
        <v-row dense>
          <v-col cols="12" md="10" lg="7" xl="8">
            <v-text-field
              label="Search patterns by name, methods used e.t.c"
              single-line
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              solo
              @change="fetchPattern"
              flat
              hide-details="auto"
              class="rounded-lg"
            ></v-text-field>
          </v-col>
          <v-col cols="3" md="2" lg="2" xl="1">
            <v-btn
              class="rounded-lg"
              large
              depressed
              height="48px"
              width="100%"
              color="primary"
            >
              Filters
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="6" md="4" lg="3" xl="2">
            <v-select
              :items="sort_order"
              v-model="sort_model"
              solo
              flat
              @change="fetchPattern"
              item-text="value"
              item-value="key"
              return-object
              prepend-icon="mdi-sort"
              hide-details="auto"
            ></v-select>
          </v-col>
          <v-col class="my-auto" cols="6" md="4">
            <div class="body-1 grey--text">Found: {{ numFound }} results</div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="6" md="4" lg="3" xl="2">
            <v-select
              v-model="display_item"
              :items="display_items"
              item-text="state"
              item-value="value"
              solo
              flat
              return-object
              hide-details="auto"
              @change="fetchDisplay"
            ></v-select>
          </v-col>
        </v-row>
      </div>
      <v-row dense class="mx-n4" :key="display_id">
        <v-col
          class="pa-4"
          cols="12"
          md="4"
          xl="3"
          v-for="(pattern, i) in patterns"
          :key="i"
        >
          <PatternCard :pattern="pattern" />
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center py-10" v-if="patterns.length">
      <v-pagination
        color="grey"
        v-model="page"
        :length="paginationLength"
        :total-visible="7"
      ></v-pagination>
    </div>

    <v-dialog v-model="filter_dialog" max-width="600">
      <v-card class="grey lighten-5">
        <v-card-title class="py-3">
          <v-row>
            <v-col cols="11">
              <div class="text-h5 black--text">Filter</div>
            </v-col>
            <v-col>
              <div class="mb-4">
                <v-icon @click.stop="filter_dialog = false">mdi-close</v-icon>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <div class="black--text font-weight-bold">Sort</div>
              <v-select
                value="По алфавиту (от А до Я)"
                solo
                flat
                prepend-icon="mdi-swap"
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-3">
          <v-btn class="body-2" @click="filter_dialog = false" elevation="0">
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn elevation="0" color="primary" class="body-2"> Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PatternCard from "@/components/PatternCard.vue";

export default {
  computed: mapState(["patterns"]),
  watch: {
    page() {
      this.fetchPattern();
    },
  },
  methods: {
    fetchDisplay() {
      this.page = 1;
      this.fetchPattern();
    },
    fetchPattern() {
      const filters = {
        city: this.sort_by_city,
        currentPage: this.page,
        pageSize: this.display_item.value,
        queryString: this.search,
        sortBy: this.sort_model.key,
      };
      this.$store
        .dispatch("getPatterns", filters)
        .then(({ paginationLength, numFound }) => {
          this.paginationLength = paginationLength;
          this.numFound = numFound;
        });
    },
    goToMapAll() {
      this.$store
        .dispatch("showPatternsOnMap", this.patterns)
        .then(() => this.$router.push({ name: "pattern-map-all" }));
    },
  },
  data() {
    return {
      page: 1,
      search: "",
      paginationLength: 10,
      numFound: 0,
      display_id: 0,
      sort_order: [
        { key: 1, value: "By name (А - Z)" },
        { key: 0, value: "By name (Z - A)" },
      ],
      sort_model: { key: 1, value: "By name (А - Z)" },

      display_item: { state: "Per page 9", value: 9 },
      display_items: [
        { state: "Per page 9", value: 9 },
        { state: "Per page 27", value: 27 },
        { state: "Per page 42", value: 42 },
        { state: "Per page 81", value: 81 },
      ],
      filter_dialog: false,
    };
  },
  components: { PatternCard },
  created() {
    this.fetchPattern();
  },
};
</script>

<style>
.reset-link {
  text-decoration: none;
  color: unset !important;
}
</style>
