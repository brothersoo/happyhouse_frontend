<template>
  <div class="selected-houses-box">
    <b-badge
      v-for="selectedHouse in selectedHouses"
      :key="selectedHouse.id"
      variant="info"
      class="badge-lg"
      >{{ selectedHouse.aptName }}
      <i
        class="ni ni-fat-remove"
        @click="removeSelectedHouse(selectedHouse.id)"
      ></i
    ></b-badge>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["selectedHouses"]),
  },
  methods: {
    ...mapActions(["removeSelectedHouse"]),
  },
};
</script>

<style>
.badge-lg {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
