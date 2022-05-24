<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-alert
        v-model="showHouseSelectNumberLimitAlert"
        show
        dismissible
        variant="warning"
      >
        <span class="alert-text">다섯개 이상 지정할 수 없습니다</span>
      </b-alert>
      <b-alert
        v-model="showAlreadySelectedHouseAlert"
        show
        dismissible
        variant="warning"
      >
        <span class="alert-text">이미 선택된 집입니다</span>
      </b-alert>
      <!-- Card stats -->
      <!-- <b-row>
        <b-col xl="3" md="6">
          <stats-card
            title="Total traffic"
            type="gradient-red"
            sub-title="350,897"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Total traffic"
            type="gradient-orange"
            sub-title="2,356"
            icon="ni ni-chart-pie-35"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-success mr-2">12.18%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Sales"
            type="gradient-green"
            sub-title="924"
            icon="ni ni-money-coins"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-danger mr-2">5.72%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Performance"
            type="gradient-info"
            sub-title="49,65%"
            icon="ni ni-chart-bar-32"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-success mr-2">54.8%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
      </b-row> -->
      <!-- Card stats end -->

      <!-- Area dropdown selector -->
      <b-row>
        <house-deal></house-deal>
      </b-row>

      <b-row>
        <selected-houses></selected-houses>
      </b-row>
      <!-- Area dropdown selector end-->
    </base-header>

    <!--Charts-->
    <b-container fluid class="mt--7">
      <b-row>
        <b-col xl="8" class="mb-5 mb-xl-0">
          <card type="default" header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-light text-uppercase ls-1 mb-1">Overview</h6>
                <h5 class="h3 text-white mb-0">{{ bigLineChartLabel }}</h5>
              </b-col>
              <b-col>
                <b-nav class="nav-pills justify-content-end">
                  <b-nav-item
                    class="mr-2 mr-md-0"
                    :active="bigLineChart.type === 'year'"
                    link-classes="py-2 px-3"
                    @click="changeDateType('year')"
                  >
                    <span class="d-none d-md-block">Year</span>
                    <span class="d-md-none">Y</span>
                  </b-nav-item>
                  <b-nav-item
                    link-classes="py-2 px-3"
                    :active="bigLineChart.type === 'month'"
                    @click="changeDateType('month')"
                  >
                    <span class="d-none d-md-block">Month</span>
                    <span class="d-md-none">M</span>
                  </b-nav-item>
                </b-nav>
              </b-col>
            </b-row>
            <line-chart
              :height="350"
              ref="bigChart"
              :chart-data="bigLineChart.chartData"
              :extra-options="bigLineChart.extraOptions"
            >
            </line-chart>
          </card>
        </b-col>

        <b-col xl="4" class="mb-5 mb-xl-0">
          <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                <h5 class="h3 mb-0">Total orders</h5>
              </b-col>
            </b-row>

            <bar-chart
              :height="350"
              ref="barChart"
              :chart-data="redBarChart.chartData"
            >
            </bar-chart>
          </card>
        </b-col>
      </b-row>
      <!-- End charts-->

      <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="8" class="mb-5 mb-xl-0">
          <page-visits-table></page-visits-table>
        </b-col>
        <b-col xl="4" class="mb-5 mb-xl-0">
          <social-traffic-table></social-traffic-table>
        </b-col>
      </b-row>
      <!--End tables-->
    </b-container>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";

// Area
import HouseDeal from "@/components/Condition/HouseDeal";

// Charts
import * as chartConfigs from "@/components/Charts/config";
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";

// Components
import BaseProgress from "@/components/BaseProgress";
import StatsCard from "@/components/Cards/StatsCard";

// Tables
import SocialTrafficTable from "./Dashboard/SocialTrafficTable";
import PageVisitsTable from "./Dashboard/PageVisitsTable";
import SelectedHouses from "../components/Condition/SelectedHouses.vue";

export default {
  components: {
    LineChart,
    BarChart,
    BaseProgress,
    StatsCard,
    PageVisitsTable,
    SocialTrafficTable,
    HouseDeal,
    SelectedHouses,
  },
  data() {
    return {
      redBarChart: {
        chartData: {
          labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Sales",
              data: [25, 20, 30, 22, 17, 29],
            },
          ],
        },
        extraOptions: chartConfigs.blueChartOptions,
      },
    };
  },
  computed: {
    ...mapState([
      "bigLineChart",
      "showHouseSelectNumberLimitAlert",
      "showAlreadySelectedHouseAlert",
    ]),
    ...mapGetters(["bigLineChartLabel"]),
    showHouseSelectNumberLimitAlert: {
      get() {
        return this.$store.state.showHouseSelectNumberLimitAlert;
      },
      set(value) {
        this.$store.commit("HOUSE_SELECT_NUMBER_LIMIT_ALERT");
      },
    },
    showAlreadySelectedHouseAlert: {
      get() {
        return this.$store.state.showAlreadySelectedHouseAlert;
      },
      set(value) {
        this.$store.commit("ALREADY_SELECTED_HOUSE_ALERT");
      },
    },
  },
  methods: {
    ...mapActions(["setBigLineChart", "setType"]),
    changeDateType(type) {
      if (this.bigLineChart.type !== type) {
        this.setType(type);
        this.setBigLineChart();
      }
    },
    initBigChart() {
      this.setBigLineChart();
    },
  },
};
</script>
<style>
.el-table .cell {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
