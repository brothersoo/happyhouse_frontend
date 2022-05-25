<template>
  <b-list-group>
    <b-list-group-item id="badge-box">
      <p v-if="noHouseSelected">아파트를 최대 다섯개 선택하세요</p>
      <b-badge
        v-for="(selectedHouse, index) in selectedHouses"
        :key="selectedHouse.id"
        :variant="getThemeColor(index)"
        class="badge-lg"
        >{{ selectedHouse.aptName }}
        <i
          class="ni ni-fat-remove"
          @click="removeSelectedHouse(selectedHouse.id)"
        ></i>
      </b-badge>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { themeColors } from "@/store";

export default {
  computed: {
    ...mapState(["selectedHouses"]),
    noHouseSelected() {
      return this.selectedHouses.length === 0;
    },
  },
  methods: {
    ...mapActions(["removeSelectedHouse"]),
    getThemeColor(index) {
      return themeColors[index];
    },
  },
};
</script>

<style>
.badge-lg {
  margin-left: 1em;
  margin-right: 1em;
}
#badge-box {
  margin-left: 1em;
  width: 920px;
  height: 63px;
}
</style>
