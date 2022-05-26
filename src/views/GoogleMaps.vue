<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
    <h1 id="title">MAP Search</h1>
      <!-- Area dropdown selector -->
      <b-row>
        <house-map-search></house-map-search>
        <b-button
          variant="secondary"
          size="sm"
          @click="displayMarkers"
          class="btn btn-sm btn-primary searchBtn"
          >아파트 검색 Go!</b-button>
      </b-row>
      <!-- Area dropdown selector end-->
    </base-header>

    
    <b-container fluid class="mt--7">
      
        <!--Map-->
        <b-row>
          <b-col>
            <b-card no-body class="border-0">
              <div id="map" class="map-canvas" style="height: 500px;"></div>
              <ul id="category">
                <li id="BK9" data-order="0"> 
                    <span class="category_bg bank"></span>
                    은행
                </li>       
                <li id="MT1" data-order="1"> 
                    <span class="category_bg mart"></span>
                    마트
                </li>  
                <li id="PM9" data-order="2"> 
                    <span class="category_bg pharmacy"></span>
                    약국
                </li>  
                <li id="OL7" data-order="3"> 
                    <span class="category_bg oil"></span>
                    주유소
                </li>  
                <li id="CE7" data-order="4"> 
                    <span class="category_bg cafe"></span>
                    카페
                </li>  
                <li id="CS2" data-order="5"> 
                    <span class="category_bg store"></span>
                    편의점
                </li>      
            </ul>
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
      selectedMarker: null,
      categoryMarkers: [],
      currCategory: '', // 현재 선택된 카테고리를 가지고 있을 변수
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

      this.displayCategoryMarkers();
      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();

      var selectedMarker = null;
      var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 마커이미지의 주소입니다    
          imageSize = new kakao.maps.Size(24, 35); // 마커이미지의 크기입니다
          // imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      // var clickImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      var clickImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

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

              // 마커 이미지 변경

              // 결과값으로 받은 위치를 마커로 표시합니다
              var marker = new kakao.maps.Marker({
                  map: this.map,
                  position: coords,
                  title: item.aptName,
                  clickable: true,
                  // image: markerImage, // 마커이미지 설정
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
                // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
                // 마커의 이미지를 클릭 이미지로 변경합니다
                if (!selectedMarker || selectedMarker !== marker) {

                    // 클릭된 마커 객체가 null이 아니면
                    // 클릭된 마커의 이미지를 기본 이미지로 변경하고
                    !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

                    // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
                    marker.setImage(clickImage);
                }

                // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
                selectedMarker = marker;
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
    },

    showAptDeal(houseId) {
      this.getHouseDealList(houseId);
    },

    displayCategoryMarkers() {  // 카테고리 검색 
      var ps = new kakao.maps.services.Places(this.map); // 장소 검색 객체생성
      
      // 지도에 idle 이벤트를 등록
      kakao.maps.event.addListener(this.map, 'idle', () => {
        // 카테고리 검색을 요청
        if (!this.currCategory) { return; }
        this.removeCategoryMarker();
        ps.categorySearch(this.currCategory, (data, status, pagination) => {
                
          if (status === kakao.maps.services.Status.OK) {
            // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
            var order = document.getElementById(this.currCategory).getAttribute('data-order');
            for ( var i=0; i<data.length; i++ ) {
              // 마커를 생성하고 지도에 표시합니다

              var position = new kakao.maps.LatLng(data[i].y, data[i].x);

              var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                  imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
                  imgOptions =  {
                      spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
                      spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                      offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                  },
                  markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                  
                  categoryMarker = new kakao.maps.Marker({
                      map: this.map,
                      position: position, // 마커의 위치
                      image: markerImage 
                  });
              categoryMarker.setMap(this.map);  
              this.categoryMarkers.push(categoryMarker);
            }
          } 
        }, {useMapBounds:true}); 
      });
        
      // 각 카테고리에 클릭 이벤트를 등록
      var category = document.getElementById("category"),
          children = category.children;

      if(children.length > 0){
        Object.values(children).forEach((el) => {
  
          el.onclick = () => {
            if (el.className === 'on') {
                this.currCategory = '';
                for (var j=0; j<children.length; j++ ) {
                  children[j].className = '';
                }
                this.removeCategoryMarker();

            } else {
              this.currCategory = el.id;
              for (var j=0; j<children.length; j++ ) {
                children[j].className = '';
              }
              el.className = 'on';

              if (!this.currCategory) { return; }
              this.removeCategoryMarker();
              ps.categorySearch(this.currCategory, (data, status, pagination) => {
                
                if (status === kakao.maps.services.Status.OK) {
                  // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
                  var order = document.getElementById(this.currCategory).getAttribute('data-order');
                  for ( var i=0; i<data.length; i++ ) {
                    // 마커를 생성하고 지도에 표시합니다

                    var position = new kakao.maps.LatLng(data[i].y, data[i].x);

                    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                        imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
                        imgOptions =  {
                            spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
                            spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                            offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                        },
                        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                        
                        categoryMarker = new kakao.maps.Marker({
                            map: this.map,
                            position: position, // 마커의 위치
                            image: markerImage 
                        });
                    categoryMarker.setMap(this.map);  
                    this.categoryMarkers.push(categoryMarker);
                  }
                } 
              }, {useMapBounds:true}); 
            }
          };
        });
      }
    },

    removeCategoryMarker() {
      for ( var i = 0; i < this.categoryMarkers.length; i++ ) {
          this.categoryMarkers[i].setMap(null);
      }   
      this.categoryMarkers = [];
    },

    
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
        `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      document.head.appendChild(script);
    }
  }
};
</script>

<style>
#title {
  color: aliceblue;
}
.searchBtn {width: 150px; height: 45px;}
.map_wrap, .map_wrap * {margin:0; padding:0;font-family:'Malgun Gothic',dotum,'돋움',sans-serif;font-size:12px;}
.map_wrap {position:relative;width:100%;height:350px;}
#category {position:absolute;top:10px;left:10px;border-radius: 5px; border:1px solid #909090;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);background: #fff;overflow: hidden;z-index: 2;}
#category li {float:left;list-style: none;width:50px;border-right:1px solid #acacac;padding:6px 0;text-align: center; cursor: pointer;}
#category li.on {background: #eee;}
#category li:hover {background: #ffe6e6;border-left:1px solid #acacac;margin-left: -1px;}
#category li:last-child{margin-right:0;border-right:0;}
#category li span {display: block;margin:0 auto 3px;width:27px;height: 28px;}
#category li .category_bg {background:url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png) no-repeat;}
#category li .bank {background-position: -10px 0;}
#category li .mart {background-position: -10px -36px;}
#category li .pharmacy {background-position: -10px -72px;}
#category li .oil {background-position: -10px -108px;}
#category li .cafe {background-position: -10px -144px;}
#category li .store {background-position: -10px -180px;}
#category li.on .category_bg {background-position-x:-46px;}
.placeinfo_wrap {position:absolute;bottom:28px;left:-150px;width:300px;}
.placeinfo {position:relative;width:100%;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;padding-bottom: 10px;background: #fff;}
.placeinfo:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}
.placeinfo_wrap .after {content:'';position:relative;margin-left:-12px;left:50%;width:22px;height:12px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
.placeinfo a, .placeinfo a:hover, .placeinfo a:active{color:#fff;text-decoration: none;}
.placeinfo a, .placeinfo span {display: block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
.placeinfo span {margin:5px 5px 0 5px;cursor: default;font-size:13px;}
.placeinfo .title {font-weight: bold; font-size:14px;border-radius: 6px 6px 0 0;margin: -1px -1px 0 -1px;padding:10px; color: #fff;background: #d95050;background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;}
.placeinfo .tel {color:#0f7833;}
.placeinfo .jibun {color:#999;font-size:11px;margin-top:0;}
</style>
