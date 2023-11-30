"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import arrowDownSvg from "@/assets/arrow-down.svg";
import { FilterValues } from "@/constants/mapData";
import MapSidebar from "@/components/map/sidebar";
import MapInput from "@/components/map/input";
import { fetcher } from "@/api/fetcher";
import { useRecoilState, useRecoilValue } from "recoil";
import { buildingOnView, sidebarRecoilData, sidebarSort } from "@/state/atom";
import { SortValues } from "@/constants/mapData";
import { IApiData } from "@/interfaces/calcData";

const INITIAL_MAP_POSITION = {
  lat: 37.532199,
  lng: 127.016908,
};
const INITIAL_MAP_ZOOM = 8;

const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export default function Home() {
  // const [buildingData, setBuildingData] = useState<any>([]);
  // const [doneFlag, setDoneFlag] = useState(false); // for infinite scroll
  // const [pageNum, setPageNum] = useState(1);
  const [sidebarID, setSidebarID] = useRecoilState(sidebarRecoilData);
  const mapRef = useRef<any>(null);
  const sidebarSortState = useRecoilValue(sidebarSort);
  const [selectedBuilding, setSelectedBuilding] =
    useRecoilState(buildingOnView);
  const markersRef = useRef<any>([]);

  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    const kakaoMapScript = document.createElement("script");
    kakaoMapScript.async = false;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7d7a1d63a24ac8006105cfc4f1595c5c&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          var container = document.getElementById("map");
          var options = {
            center: new window.kakao.maps.LatLng(
              INITIAL_MAP_POSITION.lat,
              INITIAL_MAP_POSITION.lng
            ),
            level: INITIAL_MAP_ZOOM,
          };

          mapRef.current = new window.kakao.maps.Map(container, options);
          if (mapRef.current !== null) {
            const logMapBounds = () => {
              const bounds = mapRef.current.getBounds();
              console.log("Map Bounds:", bounds);
              console.log("south west:", bounds.getSouthWest().toString());
            };

            // Add event listeners
            window.kakao.maps.event.addListener(
              mapRef.current,
              "dragend",
              logMapBounds
            );
            window.kakao.maps.event.addListener(
              mapRef.current,
              "zoom_changed",
              logMapBounds
            );
          }
        });
      }
    };

    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
    return () => kakaoMapScript.removeEventListener("load", onLoadKakaoAPI);
  }, []);

  useEffect(() => {
    if (sidebarID === null) return;

    const chosen = selectedBuilding.find(
      (sb: IApiData) => sb.rstate.id === sidebarID
    )!;
    if (chosen && mapRef.current) {
      const position = new window.kakao.maps.LatLng(
        chosen.rstate.articleDetail_latitude,
        chosen.rstate.articleDetail_longitude - 0.0025
      );
      console.log("position", position);
      mapRef.current.setCenter(position);
      mapRef.current.setLevel(3);
      //set zoom level to 3
    }
  }, [sidebarID]);

  useEffect(() => {
    fetcher
      .get(
        `rstate?${getKeyByValue(SortValues, sidebarSortState.value)}_top_n=2000`
      )
      .then((res) => {
        console.log(res.data.data);
        setSelectedBuilding(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, [sidebarSortState.value]);

  const handleMapChangetoDistrict = () => {
    if (window.kakao) {
      const MAP_DISTRICT = window.kakao.maps.MapTypeId.USE_DISTRICT;
      const MAP_ROAD = window.kakao.maps.MapTypeId.ROADMAP;
      mapRef.current.removeOverlayMapTypeId(MAP_ROAD);
      mapRef.current.addOverlayMapTypeId(MAP_DISTRICT);
    }
  };

  const handleMapChangetoRoad = () => {
    if (window.kakao) {
      const MAP_DISTRICT = window.kakao.maps.MapTypeId.USE_DISTRICT;
      const MAP_ROAD = window.kakao.maps.MapTypeId.ROADMAP;
      mapRef.current.removeOverlayMapTypeId(MAP_DISTRICT);
      mapRef.current.addOverlayMapTypeId(MAP_ROAD);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker: any) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  useEffect(() => {
    if (selectedBuilding.length > 0 && mapRef.current) {
      clearMarkers();
      selectedBuilding.slice(0, 500).forEach((building: IApiData) => {
        const position = new window.kakao.maps.LatLng(
          building.rstate.articleDetail_latitude,
          building.rstate.articleDetail_longitude
        );

        const marker = new window.kakao.maps.Marker({
          position,
          map: mapRef.current,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${building.rstate.articleDetail_exposureAddress}</div>`,
        });

        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          infowindow.open(mapRef.current, marker);
        });
        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          infowindow.close();
        });
        window.kakao.maps.event.addListener(marker, "click", function () {
          setSidebarID(building.rstate.id);
        });
        markersRef.current.push(marker);
      });
    }
  }, [selectedBuilding]);

  return (
    <>
      <main className="w-full h-[calc(100vh-64px)] relative">
        <MapSidebar />
        <MapInput />
        <div
          id="map"
          className="w-full h-full"
        />
        <div className="absolute max-w-[50vw] overflow-x-scroll right-4 top-4 gap-2 flex flex-row z-50">
          {Object.entries(FilterValues).map(([key, value]) => (
            <div
              key={key}
              className="bg-white flex-shrink-0 shadow-md rounded-3xl px-4 py-1 flex gap-2 border text-gray-400"
            >
              {value.label}
              <Image
                src={arrowDownSvg}
                alt="arrowDown"
                width={16}
                height={16}
              />
            </div>
          ))}
        </div>
        <div className="absolute right-4 bottom-4 z-50 flex flex-row gap-2">
          <div
            className="w-24 h-8 bg-white shadow-md rounded-md z-50 flex items-center justify-center"
            onClick={handleMapChangetoDistrict}
          >
            지적편집도
          </div>
          <div
            className="w-24 h-8 bg-white shadow-md rounded-md z-50 flex items-center justify-center"
            onClick={handleMapChangetoRoad}
          >
            일반지도
          </div>
        </div>
      </main>
    </>
  );
}
