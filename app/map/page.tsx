"use client";

import Image from "next/image";
import { useEffect } from "react";
import arrowDownSvg from "@/assets/arrow-down.svg";
import { FilterValues } from "@/constants/mapData";
import MapSidebar from "@/components/map/sidebar";
import MapInput from "@/components/map/input";

const INITIAL_MAP_POSITION = {
  lat: 37.532199,
  lng: 127.016908,
};
const INITIAL_MAP_ZOOM = 8;

export default function Home() {
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

          var map = new window.kakao.maps.Map(container, options);
        });
      }
    };

    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
  }, []);

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
