<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Area dropdown selector -->
      <b-row>
        <house-map-search></house-map-search>
        <b-button
          variant="secondary"
          size="sm"
          @click="displayMarkers"
          class="btn btn-sm btn-primary"
          >아파트 검색</b-button>
      </b-row>
      <!-- Area dropdown selector end-->
    </base-header>

    
    <b-container fluid class="mt--7">
      <!--Map-->
      <b-row>
        <b-col>
          <b-card no-body class="border-0">
            <div id="map" class="map-canvas"
                style="height: 500px;"></div>
          </b-card>
        </b-col>
      </b-row>
      <!-- End Map-->

      <!--AptDeal Table-->
      <b-row>
        <b-col>
          <house-deal-table/>
        </b-col>
      </b-row>
      <!--End AptDeal Table-->
    </b-container>
  </div>
</template>
<script>
import { API_KEY } from './Maps/API_KEY';
import { mapState, mapActions } from "vuex";


import HouseMapSearch from "@/components/Maps/HouseMapSearch";
import HouseDealTable from "@/components/Maps/HouseDealTable";

export default {
  data() {
    return {
      map: null,
      markers: [],
    };
  },
  components: {
    HouseMapSearch,
    HouseDealTable,
  },
  computed: {
    ...mapState(["houses", "house", "deals"]),
  },
  methods: {
    ...mapActions(["getHouseDealList"]),
    initMap() {
      const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
      const options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 3, //지도의 레벨(확대, 축소 정도)
      };
      this.map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
    },

    displayMarkers(){
      let i = 0;
      //1. 현재 표시되어있는 marker들이 있다면 marker에 등록된 map을 없애준다.
      if(this.markers.length > 0){
        this.markers.forEach((item) => {
          item.setMap(null);
        });
      }

      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();

      // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
      // var bounds = new kakao.maps.LatLngBounds();    
      let j = 0;
      this.houses.forEach((item) => {
        if(j==0) {
          j++;
        } else {
          // 아파트 주소: 동 지번
          var address = item.upmyundong.name + ' ' + item.jibun;
          // 주소로 좌표를 검색합니다
          geocoder.addressSearch(address, (result, status) => {
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
              var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

              // 결과값으로 받은 위치를 마커로 표시합니다
              var marker = new kakao.maps.Marker({
                  map: this.map,
                  position: coords,
                  title: item.aptName,
                  clickable: true,
              });

              // 인포윈도우로 장소에 대한 설명을 표시합니다
              var infowindow = new kakao.maps.InfoWindow({
                  content: '<div style="width:170px;text-align:center;padding:6px 0;">' + item.aptName + '</div>',
                  position: coords,
                  removable: true,
              });

              // 마커에 mouseover, mouseout, click 이벤트를 등록
              kakao.maps.event.addListener(marker, "mouseover", () => {infowindow.open(this.map, marker);});
              kakao.maps.event.addListener(marker, "mouseout", () => {infowindow.close(this.map, marker);});

              // 마커에 click 이벤트를 등록합니다
              kakao.maps.event.addListener(marker, 'click', () => {

                this.showAptDeal(item.id);

                // selectedMarker = marker;
              });


              i++;
              this.markers.push(marker);
              if(i==1){
                this.map.panTo(coords);
              }
            } 
          });
        }
      });

      // this.map.setBounds(bounds);
    },

    showAptDeal(houseId) {
      this.getHouseDealList(houseId);
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      console.log("이미 로딩됨: ", window.kakao);
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&libraries=services&autoload=false`;
      document.head.appendChild(script);
    }
  }
};
</script>
