<template>
  <div id="area-selection">
    <base-input class="selection">
      <select v-model="sido" @change="sidoSelected" class="form-control">
        <option v-for="sido in sidos" :key="sido.id" :value="sido">
          {{ sido.name }}
        </option>
      </select>
    </base-input>
    <base-input class="selection">
      <select v-model="sigugun" @change="sigugunSelected" class="form-control">
        <option v-for="sigugun in siguguns" :key="sigugun.id" :value="sigugun">
          {{ sigugun.name }}
        </option>
      </select>
    </base-input>
    <base-input class="selection">
      <select
        v-model="upmyundong"
        @change="upmyundongSelected"
        class="form-control"
      >
        <option
          v-for="upmyundong in upmyundongs"
          :key="upmyundong.id"
          :value="upmyundong"
        >
          {{ upmyundong.name }}
        </option>
      </select>
    </base-input>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["sidos", "siguguns", "upmyundongs", "houses"]),
    sido: {
      get() {
        return this.$store.state.sido;
      },
      set(value) {
        this.$store.commit("SET_SIDO", value);
      },
    },
    sigugun: {
      get() {
        return this.$store.state.sigugun;
      },
      set(value) {
        this.$store.commit("SET_SIGUGUN", value);
      },
    },
    upmyundong: {
      get() {
        return this.$store.state.upmyundong;
      },
      set(value) {
        this.$store.commit("SET_UPMYUNDONG", value);
      },
    },
    house: {
      get() {
        return this.$store.state.house;
      },
      set(value) {
        this.$store.commit("SET_HOUSE", value);
      },
    },
  },
  methods: {
    ...mapActions([
      "setSidos",
      "setSiguguns",
      "setUpmyundongs",
      "setHouses",
    ]),
    sidoSelected() {
      console.log("sido selected", this.sido.code);
      this.setSiguguns(this.sido.code);
    },
    sigugunSelected() {
      console.log("sigugun selected");
      this.setUpmyundongs(this.sigugun.code);
    },
    upmyundongSelected() {
      console.log("upmyundong selected");
      this.setHouses(this.upmyundong.code);
    },
  },
  created() {
    this.setSidos();
  },
};
</script>

<style>
#area-selection {
  display: flex;
}
.selection {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
