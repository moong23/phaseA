"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import arrowDownSvg from "@/assets/arrow-down.svg";
import { FilterValues } from "@/constants/mapData";
import MapSidebar from "@/components/map/sidebar";
import MapInput from "@/components/map/input";
import { fetcher } from "@/api/fetcher";
import { useRecoilState } from "recoil";
import { sidebarRecoilData } from "@/state/atom";

const INITIAL_MAP_POSITION = {
  lat: 37.532199,
  lng: 127.016908,
};
const INITIAL_MAP_ZOOM = 8;

export default function Home() {
  const [buildingData, setBuildingData] = useState<any[]>([]);
  const [doneFlag, setDoneFlag] = useState(false); // for infinite scroll
  const [pageNum, setPageNum] = useState(1);
  const [sidebarID, setSidebarID] = useRecoilState(sidebarRecoilData);
  const mapRef = useRef(null);
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
        });
      }
    };

    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
    return () => kakaoMapScript.removeEventListener("load", onLoadKakaoAPI);
  }, []);

  useEffect(() => {
    if (pageNum === -1) return;
    fetcher
      .get(`rstate/?page=${pageNum}`)
      .then((res) => {
        // console.log(res.data.data);
        if (res.data.data.length === 0) {
          setPageNum(-1);
          setDoneFlag(true);
          console.log("total building data num: ", buildingData.length);
          return;
        } else {
          setBuildingData((prev) => [...prev, ...res.data.data]);
          setPageNum((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        setPageNum(-1);
      });
  }, [pageNum]);

  useEffect(() => {
    if (buildingData.length > 0 && mapRef.current) {
      buildingData.forEach((building) => {
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
      });
    }
  }, [doneFlag]);

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
