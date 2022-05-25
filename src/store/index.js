import Vue from "vue";
import Vuex from "vuex";
import http from "@/util/http";

import * as chartConfigs from "@/components/Charts/config";

Vue.use(Vuex);

const defaultSido = {
  name: "특별시/도",
  code: "",
};

const defaultSigugun = {
  name: "시/구/군",
  code: "",
};

const defaultUpmyundong = {
  name: "읍/면/동",
  code: "",
};

const defaultHouse = {
  aptName: "건물명",
  id: 0,
};

export const theme = {
  'default': '#172b4d',
  'primary': '#5e72e4',
  'secondary': '#f4f5f7',
  'info': '#11cdef',
  'success': '#2dce89',
  'danger': '#f5365c',
  'warning': '#fb6340'
};
export const themeColors = ["primary", "info", "success", "danger", "warning"];

export default new Vuex.Store({
  state: {
    houseSelectNumberLimitAlertDismissCountDown: 0,
    alreadySelectedHouseAlertDismissCountDown: 0,

    sidos: [defaultSido],
    siguguns: [defaultSigugun],
    upmyundongs: [defaultUpmyundong],
    houses: [defaultHouse],
    sido: defaultSido,
    sigugun: defaultSigugun,
    upmyundong: defaultUpmyundong,
    house: defaultHouse,
    selectedHouses: [],
    fromDate: "",
    toDate: "",
    bigLineChart: {
      type: "",
      allData: [],
      chartData: {
        datasets: [],
        labels: [],
      },
      extraOptions: chartConfigs.blueChartOptions,
    },
  },
  getters: {
    sidos(state) {
      return state.sidos;
    },
    siguguns(state) {
      return state.siguguns;
    },
    upmyundongs(state) {
      return state.upmyundongs;
    },
    sido(state) {
      return state.sido;
    },
    sigugun(state) {
      return state.sigugun;
    },
    upmyundong(state) {
      return state.upmyundong;
    },
    graphAPIParams(state) {
      var fromDate = state.fromDate.split("-");
      var toDate = state.toDate.split("-");
      let houseIds = [];
      for (let house of state.selectedHouses) {
        houseIds.push(house.id);
      }
      return {
        code: state.upmyundong.code,
        type: state.bigLineChart.type,
        houseIds: houseIds.join(","),
        fromYear: fromDate[0],
        toYear: toDate[0],
        fromMonth: fromDate[1],
        toMonth: toDate[1],
      }
    },
    bigLineChartLabel(state) {
      if (state.fromDate && state.toDate) {
        var fromDate = state.fromDate.split("-");
        var toDate = state.toDate.split("-");
        return `${fromDate[0]}년 ${fromDate[1]}월 ~ ${toDate[0]}년 ${toDate[1]}월 평균 거래가`;
      } else {
        return "조건을 선택해주세요"
      }
    },
    selectedHousesNames(state) {
      let names = [];
      for (let house of state.selectedHouses) {
        names.push(house.aptName);
      }
      return names;
    }
  },
  mutations: {
    SET_SIDO(state, payload) {
      state.sido = payload;
    },
    SET_SIGUGUN(state, payload) {
      state.sigugun = payload;
    },
    SET_UPMYUNDONG(state, payload) {
      state.upmyundong = payload;
    },
    SET_HOUSE(state, payload) {
      state.house = payload;
    },
    SET_SIDOS(state, payload) {
      state.sidos = payload;
    },
    SET_SIGUGUNS(state, payload) {
      state.siguguns = payload;
    },
    SET_UPMYUNDONGS(state, payload) {
      state.upmyundongs = payload
    },
    SET_HOUSES(state, payload) {
      state.houses = payload;
    },
    SET_BIG_LINE_CHART(state, payload) {
      console.log(payload);
      state.bigLineChart.chartData = payload;
    },
    SET_FROM_DATE(state, payload) {
      state.fromDate = payload;
    },
    SET_TO_DATE(state, payload) {
      state.toDate = payload;
    },
    SET_TYPE(state, payload) {
      state.bigLineChart.type = payload;
    },
    ADD_SELECTED_HOUSE(state) {
      if (state.house.id) {
        state.selectedHouses.push(state.house);
      }
    },
    REMOVE_SELECTED_HOUSE(state, removalHouseId) {
      for (let i = 0; i < state.selectedHouses.length; i++) {
        if (state.selectedHouses[i].id === removalHouseId) {
          state.selectedHouses.splice(i, 1);
          break;
        }
      }
    },
    HOUSE_SELECT_NUMBER_LIMIT_ALERT(state, payload) {
      state.houseSelectNumberLimitAlertDismissCountDown = payload;
    },
    ALREADY_SELECTED_HOUSE_ALERT(state, payload) {
      state.alreadySelectedHouseAlertDismissCountDown = payload;
    },
  },
  actions: {
    setSidos(context) {
      http
      .get("/area/sido")
      .then((response) => {
        if (response.status === 200) {
          response.data.unshift(defaultSido);
          context.commit("SET_SIDOS", response.data);
          context.commit("SET_SIDO", defaultSido);
        } else {
          console.error(response);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    },
    setSiguguns(context, sidoCode) {
      if (sidoCode) {
        http
          .get("/area/sigugun", {
            params: {
              sidoCode
            }
          }
          )
          .then((response) => {
            if (response.status === 200) {
              response.data.unshift(defaultSigugun);
              context.commit("SET_SIGUGUNS", response.data);
              context.commit("SET_SIGUGUN", response.data[0]);
            } else {
              console.error(response);
            }
          })
          .catch((err) => {
            console.error(err);
          })
      } else {
        context.commit("SET_SIGUGUNS", [defaultSigugun]);
        context.commit("SET_SIGUGUN", defaultSigugun);
      }
      context.commit("SET_UPMYUNDONGS", [defaultUpmyundong]);
      context.commit("SET_UPMYUNDONG", defaultUpmyundong);
      context.commit("SET_HOUSES", [defaultHouse]);
      context.commit("SET_HOUSE", defaultHouse)
    },
    setUpmyundongs(context, sigugunCode) {
      if (sigugunCode) {
        http
          .get("/area/upmyundong", {
            params: {
              sigugunCode
            }
          }
          )
          .then((response) => {
            if (response.status === 200) {
              response.data.unshift(defaultUpmyundong);
              context.commit("SET_UPMYUNDONGS", response.data);
              context.commit("SET_UPMYUNDONG", response.data[0]);
            } else {
              console.error(response);
            }
          })
          .catch((err) => {
            console.error(err);
          })
      } else {
        context.commit("SET_UPMYUNDONGS", [defaultUpmyundong]);
        context.commit("SET_UPMYUNDONG", defaultUpmyundong);
      }
      context.commit("SET_HOUSES", [defaultHouse]);
      context.commit("SET_HOUSE", defaultHouse);
    },
    setHouses(context, areaCode) {
      if (areaCode) {
        http
          .get("/house", {
            params: {
              code: areaCode,
            }
          })
          .then((response) => {
            if (response.status === 200) {
              response.data.unshift(defaultHouse);
              context.commit("SET_HOUSES", response.data);
              context.commit("SET_HOUSE", response.data[0]);
            } else {
              console.error(response);
            }
          })
          .catch((err) => {
            console.error(err);
          })
      } else {
        context.commit("SET_HOUSES", [defaultHouse]);
        context.commit("SET_HOUSE", defaultHouse);
      }
    },
    setType(context, type) {
      context.commit("SET_TYPE", type);
    },
    setBigLineChart(context) {
      if (context.state.house) {
        let params = context.getters.graphAPIParams;
        http
          .get("/house/deal_graph", {
            params
          })
          .then((response) => {
            if (response.status === 200) {
              for (let dataset of response.data.datasets) {
                let i = context.getters.selectedHousesNames.indexOf(dataset.label);
                dataset.borderColor = theme[themeColors[i]];
                dataset.pointBackgroundColor = theme[themeColors[i]];
              }
              context.commit("SET_BIG_LINE_CHART", response.data);
            } else {
              console.error(response);
            }
          })
          .catch((err) => {
          console.error(err);
        })
      }
    },
    addSelectedHouse(context) {
      context.commit("ADD_SELECTED_HOUSE");
    },
    removeSelectedHouse(context, houseId) {
      console.log(houseId);
      context.commit("REMOVE_SELECTED_HOUSE", houseId);
    },
    houseSelectNumberLimitAlert(context, second) {
      context.commit("HOUSE_SELECT_NUMBER_LIMIT_ALERT", second);
    },
    alreadySelectedHouseAlert(context, second) {
      context.commit("ALREADY_SELECTED_HOUSE_ALERT", second);
    }
  }
});