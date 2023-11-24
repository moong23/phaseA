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

const INITIAL_MAP_POSITION = {
  lat: 37.532199,
  lng: 127.016908,
};
const INITIAL_MAP_ZOOM = 8;

export default function Home() {
  const [buildingData, setBuildingData] = useState<any>([]);
  const [doneFlag, setDoneFlag] = useState(false); // for infinite scroll
  const [pageNum, setPageNum] = useState(1);
  const [sidebarID, setSidebarID] = useRecoilState(sidebarRecoilData);
  const mapRef = useRef<any>(null);
  const sidebarSortState = useRecoilValue(sidebarSort);
  const [selectedBuilding, setSelectedBuilding] =
    useRecoilState(buildingOnView);
  const markersRef = useRef<any>([]);

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
    let isCancelled = false;

    if (doneFlag) return;

    fetcher
      .get(`rstate/?page=${pageNum}`)
      .then((res) => {
        if (isCancelled) return;

        if (res.data.data.length === 0) {
          setPageNum(-1);
          setDoneFlag(true);
          console.log("total building data num: ", buildingData.length);
        } else {
          setBuildingData((prev: any) => [...prev, ...res.data.data]);
          setPageNum((prev) => prev + 1);
        }
      })
      .catch((err) => {
        if (isCancelled) return;

        console.log(err);
        setPageNum(-1);
      });

    return () => {
      isCancelled = true;
    };
  }, [pageNum]);

  useEffect(() => {
    const clearMarkers = () => {
      markersRef.current.forEach((marker: any) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
    const sortedBuilding = buildingData.sort((a: any, b: any) => {
      if (sidebarSortState.value === "건물 면적") {
        return -a.articleAddition_area1 + b.articleAddition_area1;
      } else if (sidebarSortState.value === "연면적") {
        return -a.lndpclAr + b.lndpclAr;
      } else if (sidebarSortState.value === "토지 가격") {
        return -a.articlePrice_dealPrice + b.articlePrice_dealPrice;
      } else if (sidebarSortState.value === "자기 투자 금액") {
        return -a.selfInvestmentPrice + b.selfInvestmentPrice;
      } else if (sidebarSortState.value === "수익률") {
        return -a.profitRate + b.profitRate;
      }
    });
    console.log(sidebarSortState.value, sortedBuilding.slice(0, 200));
    setSelectedBuilding(sortedBuilding.slice(0, 200));

    if (buildingData.length > 0 && mapRef.current) {
      clearMarkers();
      buildingData.slice(0, 200).forEach((building: any) => {
        const position = new window.kakao.maps.LatLng(
          building.articleDetail_latitude,
          building.articleDetail_longitude
        );

        const marker = new window.kakao.maps.Marker({
          position,
          map: mapRef.current,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${building.articleDetail_exposureAddress}</div>`,
        });

        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          infowindow.open(mapRef.current, marker);
        });
        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          infowindow.close();
        });
        window.kakao.maps.event.addListener(marker, "click", function () {
          setSidebarID(building.id);
        });
        markersRef.current.push(marker);
      });
    }
  }, [doneFlag, sidebarSortState]);

  return (
    <>
      <main className="w-full h-[calc(100vh-64px)] relative">
        <MapSidebar />
        <MapInput />
        <div
          id="map"
          className="w-full h-full"
        />
        <div className="absolute right-4 top-4 gap-2 flex flex-row z-50">
          {Object.entries(FilterValues).map(([key, value]) => (
            <div
              key={key}
              className="bg-white shadow-md rounded-3xl px-4 py-1 flex gap-2 border text-gray-400"
            >
              {value}
              <Image
                src={arrowDownSvg}
                alt="arrowDown"
                width={16}
                height={16}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
