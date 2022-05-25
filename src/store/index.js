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
  code: "",
};

export default new Vuex.Store({
  state: {
    sidos: [defaultSido],
    siguguns: [defaultSigugun],
    upmyundongs: [defaultUpmyundong],
    houses: [defaultHouse],
    sido: defaultSido,
    sigugun: defaultSigugun,
    upmyundong: defaultUpmyundong,
    house: defaultHouse,
    fromDate: "",
    toDate: "",
    bigLineChart: {
      type: "",
      allData: [],
      chartData: {
        datasets: [
        ],
        labels: [],
      },
      extraOptions: chartConfigs.blueChartOptions,
    },
    deals: [],
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
      return {
        code: state.upmyundong.code,
        type: state.bigLineChart.type,
        houseId: state.house.id,
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
    SET_BIG_LINE_CHART(state, deals) {
      let datasets = [];
      let avgPriceData = [];
      let labels = [];
      for (let deal of deals) {
        avgPriceData.push(deal.avgPrice);
        labels.push(deal.date)
      }
      datasets.push({
        label: "평균 거래가",
        data: avgPriceData
      });
      state.bigLineChart.chartData = {
        datasets,
        labels,
      };
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
    SET_DEAL_LIST(state, deals) {
      console.log("SET_DEAL_LIST 호출");
      console.log(deals);
      state.deals = deals;
    },
  },
  actions: {
    setSidos(context) {
      http
      .get("/area/sido")
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
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
              console.log(response);
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
              console.log(response);
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
              console.log(response);
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
              console.log(response.data.deals);
              context.commit("SET_BIG_LINE_CHART", response.data.deals);
            } else {
              console.error(response);
            }
          })
          .catch((err) => {
          console.error(err);
        })
      }
    },
    // getHouseDealList({ commit }, houseId) {
    //   // 나중에 house.일련번호를 이용하여 API 호출
    //   console.log("getHouseDealList 실행")
    //   console.log(houseId);
    //   const params = { houseId: houseId };
    //   http
    //     .get("/house/apt/deal", { params })
    //     .then(({ data }) => {
    //       console.log("dealList: ", data);
    //       console.log(commit, data);
    //       commit("SET_DEAL_LIST", data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    getHouseDealList(context, houseId) {
      if (houseId) {
        http
          .get("/house/apt/deal", {
            params: {
              houseId
            }
          }
          )
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              context.commit("SET_DEAL_LIST", response.data);
            } else {
              console.error(response);
            }
          })
          .catch((err) => {
            console.error(err);
          })
      } 
    }
  }
});