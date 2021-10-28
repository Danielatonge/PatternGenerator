<template>
  <v-card
    class="rounded-lg"
    :elevation="elevation"
    @mouseover="elevation = '2'"
    @mouseout="elevation = '0'"
    @click="goToPattern"
  >
    <v-img
      :src="
        pattern.profilePicture.length
          ? pattern.profilePicture
          : require('@/assets/team_room_1.jpg')
      "
      height="200px"
    >
      <v-container>
        <v-row class="ma-2">
          <v-btn
            @click.stop="patternPreview"
            class="rounded-lg white"
            small
            elevation="0"
          >
            Preview
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click.stop="selectPattern(pattern)"
            :class="[selected ? 'primary' : '']"
            x-small
            class="rounded-lg white"
            height="30px"
            elevation="0"
          >
            <v-icon>{{ checkPlus }}</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-img>
    <v-card-title class="pb-5">
      {{ pattern.title || "Los Angeles Clippers" | patternTitle }}
    </v-card-title>
    <v-card-subtitle>
      {{
        (pattern.address || "ул. Лермонтова, д. 14, пом. 3, г. Чита")
          | addressDescription
      }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "PatternCard",
  props: {
    pattern: Object,
  },
  mounted() {
    this.selected_patterns.forEach((x) => {
      if (x.id === this.pattern.id) {
        this.selected = true;
      }
    });
  },
  data() {
    return {
      elevation: 0,
      selected: false,
    };
  },
  methods: {
    goToPattern() {
      const patternId = this.pattern.id;
      this.$router.push({
        name: "pattern-information",
        params: { patternId },
      });
    },
    patternPreview() {
      console.log(this.pattern);
      this.$store
        .dispatch("showPatternOnMap", this.pattern)
        .then(() => this.$router.push({ name: "pattern-map-all" }));
    },
    selectPattern(pattern) {
      this.selected = !this.selected;
      if (this.selected) {
        // TODO add pattern to list of selected patterns
        this.$store.dispatch("addToSelectedPatterns", pattern);
      } else {
        // TODO remove pattern from list of selected patterns
        this.$store.dispatch("removeFromSelectedPatterns", pattern);
      }
    },
  },
  filters: {
    addressDescription: (value) => {
      if (!value) return "";
      return value.slice(0, 45);
    },
    patternTitle: (value) => {
      if (!value) return "";
      if (value.length <= 28) return value;
      return value.slice(0, 28) + "..";
    },
  },
  computed: {
    ...mapState("pattern", ["maps", "selected_patterns"]),
    checkPlus() {
      return this.selected ? "mdi-check" : "mdi-plus";
    },
  },
};
</script>

<style></style>
