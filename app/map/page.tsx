"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import arrowDownSvg from "@/assets/arrow-down.svg";
import { FilterValues } from "@/constants/mapData";
import MapSidebar from "@/components/map/sidebar";
import MapInput from "@/components/map/input";
import { fetcher } from "@/api/fetcher";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  buildingInMap,
  buildingOnView,
  sidebarRecoilData,
  sidebarSort,
} from "@/state/atom";
import { SortValues } from "@/constants/mapData";
import { IApiData } from "@/interfaces/calcData";
import blueDotSrc from "@/assets/dot.png";
import axios from "axios";

type FilterValueType = {
  label: string;
  type: string;
  initialValue: string[] | { min: number; max: number } | null;
  // value: null | number[] | string[]; // 'any' can be replaced with a more specific type based on your data
  value: string[] | { min: number; max: number } | null;
  open: boolean;
};

type FilterValuesType = {
  [key: string]: FilterValueType;
};

type ApiResponseType = {
  [key: string]: any[]; // Replace 'any[]' with more specific types as needed
};

interface IBody {
  sorting: {
    sorting_type: string;
    top_n: number;
  };
  filters: {
    articleName_filter: string[];
    lndpclAr_filter: number[];
    articlePrice_filter: number[];
    proposArea1Nm_filter: string[];
    roadSideCodeNm_filter: string[];
    floor_area_ratio_filter: number[];
    personal_investment_amount_filter: number[];
    land_price_filter: number[];
    profit_rate_filter: number[];
  };
}

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
  const customOverlaysRef = useRef<any>([]);
  const [loadDone, setLoadDone] = useState(false);
  const [filterData, setFilterData] = useState<FilterValuesType>(FilterValues);
  const [selectedBuilding, setSelectedBuilding] =
    useRecoilState<any>(buildingOnView);
  const [buildingMap, setBuildingMap] = useRecoilState<any>(buildingInMap);
  const [roadViewCoords, setRoadViewCoords] = useState({
    lat: 0,
    lng: 0,
  }); // [lat, lng
  const markersRef = useRef<any>([]);
  const [mapBounds, setMapBounds] = useState({
    sw: { lat: 0, lng: 0 },
    ne: { lat: 0, lng: 0 },
  });

  const getFilterData = async () => {
    try {
      const filterApi = await fetcher.get("rstate/filter_option/");
      const filterApiData: ApiResponseType = filterApi.data.data;

      const updatedFilterData: FilterValuesType = { ...filterData };

      Object.entries(updatedFilterData).forEach(([key, value]) => {
        if (value.type === "text") {
          let apiListKey = "";
          if (key === "prposArea1Nm") {
            apiListKey = `proposArea1Nm_list`;
          } else {
            apiListKey = `${key}_list`;
          }
          if (Array.isArray(filterApiData[apiListKey])) {
            updatedFilterData[key].initialValue = filterApiData[
              apiListKey
            ].filter((v) => v !== null);
            updatedFilterData[key].value = filterApiData[apiListKey].filter(
              (v) => v !== null
            );
          }
        } else if (value.type === "number") {
          const apiNumberData = filterApiData[key];
          if (Array.isArray(apiNumberData) && apiNumberData.length > 0) {
            updatedFilterData[key].initialValue = {
              min: Math.min(...apiNumberData),
              max: Math.max(...apiNumberData),
            };
            updatedFilterData[key].value = {
              min: Math.min(...apiNumberData),
              max: Math.max(...apiNumberData),
            };
          }
        }
      });

      setFilterData(updatedFilterData);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

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
              setMapBounds({
                sw: {
                  lat: bounds.getSouthWest().getLat(),
                  lng: bounds.getSouthWest().getLng(),
                },
                ne: {
                  lat: bounds.getNorthEast().getLat(),
                  lng: bounds.getNorthEast().getLng(),
                },
              });
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
    setLoadDone(false);
    getFilterData();
    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
    return () => kakaoMapScript.removeEventListener("load", onLoadKakaoAPI);
  }, []);

  useEffect(() => {
    if (sidebarID === null) return;

    const chosen: any = selectedBuilding.find(
      (sb: IApiData) => sb.rstate.id === sidebarID
    )!;
    if (chosen && mapRef.current) {
      const position = new window.kakao.maps.LatLng(
        chosen.rstate.articleDetail_latitude,
        // chosen.rstate.articleDetail_longitude - 0.0025
        chosen.rstate.articleDetail_longitude
      );

      mapRef.current.setCenter(position);
      mapRef.current.setLevel(1);
      //set zoom level to 3
    }
  }, [sidebarID]);

  const getApiData = async (pageNum: number, body?: IBody) => {
    fetcher
      .post(`rstate?page=${pageNum}&items_per_page=1000`, {
        filters: body?.filters || {
          articleName_filter: [],
          lndpclAr_filter: [],
          articlePrice_filter: [],
          proposArea1Nm_filter: [],
          roadSideCodeNm_filter: [],
          floor_area_ratio_filter: [],
          personal_investment_amount_filter: [],
          land_price_filter: [],
          profit_rate_filter: [],
        },
        sorting: body?.sorting || {
          sorting_type: getKeyByValue(SortValues, sidebarSortState.value)!,
          top_n: 1000000,
        },
      })
      .then((res) => {
        if (res.data.data.length === 0) {
          if (pageNum === 1) {
            throw new Error("System Error");
          }
          throw new Error("No data returned from API");
        }
        if (pageNum === 1) {
          setSelectedBuilding(res.data.data);
        } else {
          let tmp: IApiData[] = [];
          tmp = res.data.data;
          setSelectedBuilding((prev: IApiData[]) => [...prev, ...tmp]);
        }
        getApiData(pageNum + 1, body);
      })
      .catch((err) => {
        console.log(err);
        if (err.message === "No data returned from API") {
          setLoadDone(true);
        } else if (err.message === "System Error") {
          setSelectedBuilding([]);
          setLoadDone(true);
        } else if (err.message === "Request failed with status code 400") {
          console.log("done!");
          setLoadDone(true);
        } else if (err.message === "Network Error") {
          alert("server error");
          setLoadDone(true);
        }
      });
  };

  useEffect(() => {
    getApiData(1);
  }, [sidebarSortState.value]);

  const handleMapChangetoDistrict = () => {
    if (window.kakao) {
      const MAP_DISTRICT = window.kakao.maps.MapTypeId.USE_DISTRICT;
      const MAP_ROAD = window.kakao.maps.MapTypeId.ROADMAP;
      mapRef.current.removeOverlayMapTypeId(MAP_ROAD);
      mapRef.current.addOverlayMapTypeId(MAP_DISTRICT);
      var roadviewContainer = document.getElementById("roadview");
      if (roadviewContainer?.classList.contains("z-50")) {
        roadviewContainer?.classList.remove("z-50");
        roadviewContainer?.classList.add("hidden");
      }
    }
  };

  const handleMapChangetoRoad = () => {
    if (window.kakao) {
      const MAP_DISTRICT = window.kakao.maps.MapTypeId.USE_DISTRICT;
      const MAP_ROAD = window.kakao.maps.MapTypeId.ROADMAP;
      mapRef.current.removeOverlayMapTypeId(MAP_DISTRICT);
      mapRef.current.addOverlayMapTypeId(MAP_ROAD);
      var roadviewContainer = document.getElementById("roadview");
      if (roadviewContainer?.classList.contains("z-50")) {
        roadviewContainer?.classList.remove("z-50");
        roadviewContainer?.classList.add("hidden");
      }
    }
  };

  const handleMapChangetoRoadView = () => {
    if (window.kakao && roadViewCoords) {
      var roadviewContainer = document.getElementById("roadview"); // Container for roadview

      roadviewContainer?.classList.remove("hidden");
      roadviewContainer?.classList.add("z-50");
      var roadview = new kakao.maps.Roadview(roadviewContainer); // Roadview object
      var roadviewClient = new kakao.maps.RoadviewClient(); // Roadview helper object

      // Convert roadViewCoords to a kakao.maps.LatLng object
      var position = new kakao.maps.LatLng(
        roadViewCoords.lat,
        roadViewCoords.lng
      );

      // Extract the nearest panoId to the given position and display the roadview
      roadviewClient.getNearestPanoId(position, 50, function (panoId: any) {
        roadview.setPanoId(panoId, position); // Execute roadview with panoId and center coordinates
      });
    }
  };

  useEffect(() => {
    if (roadViewCoords.lat === 0 && roadViewCoords.lng === 0) return;
    console.log(roadViewCoords);
    handleMapChangetoRoadView();
    // change to the road map view
  }, [roadViewCoords]);

  const clearMarkers = () => {
    markersRef.current.forEach((marker: any) => {
      marker.setMap(null);
    });
    markersRef.current = [];
    customOverlaysRef.current.forEach((overlay: any) => {
      overlay.setMap(null); // Remove the overlay from the map
    });
    customOverlaysRef.current = [];
  };

  useEffect(() => {
    if (selectedBuilding.length > 0 && mapRef.current) {
      clearMarkers();
      if (mapRef.current.getLevel() < 7) {
        console.log(mapBounds.sw.lat, mapBounds.ne.lat);
        const renderBuilding: IApiData[] = selectedBuilding.filter(
          (building: IApiData) => {
            if (
              building.rstate.articleDetail_latitude < mapBounds.sw.lat ||
              building.rstate.articleDetail_latitude > mapBounds.ne.lat
            )
              return false;

            if (
              building.rstate.articleDetail_longitude < mapBounds.sw.lng ||
              building.rstate.articleDetail_longitude > mapBounds.ne.lng
            )
              return false;

            return true;
          }
        );
        setBuildingMap(renderBuilding);

        if (7 > mapRef.current.getLevel() && mapRef.current.getLevel() > 4) {
          renderBuilding.forEach((building: IApiData) => {
            const position = new window.kakao.maps.LatLng(
              building.rstate.articleDetail_latitude,
              building.rstate.articleDetail_longitude
            );

            const content = document.createElement("div");
            content.className = "custom-dot-marker";

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: position,
              content: content,
              map: mapRef.current,
              // Optional: specify the x and y offset of the overlay in relation to the position
              xAnchor: 0.5, // Center of the overlay horizontally
              yAnchor: 1, // Bottom of the overlay
            });
            customOverlaysRef.current.push(customOverlay);

            content.addEventListener("click", () => {
              setSidebarID(building.rstate.id);
            });
            customOverlay.setMap(mapRef.current);

            // window.kakao.maps.event.addListener(
            //   customOverlay,
            //   "click",
            //   function () {
            //     setSidebarID(building.rstate.id);
            //   }
            // );
          });
        } else if (
          2 <= mapRef.current.getLevel() &&
          mapRef.current.getLevel() <= 4
        ) {
          renderBuilding.forEach((building: IApiData) => {
            const position = new window.kakao.maps.LatLng(
              building.rstate.articleDetail_latitude,
              building.rstate.articleDetail_longitude
            );
            const marker = new window.kakao.maps.Marker({
              position,
              map: mapRef.current,
            });

            const content = document.createElement("div");
            content.className = "custom-marker-container";
            content.innerHTML = `
              <div class="custom-marker-content">
                <div>
                  ${building.rstate.articleDetail_articleName}
                </div>
                <div>
                ${building.rstate.articlePrice_dealPrice.toLocaleString()} 만원
                </div>
                <div class='profit_rate'>
                  ${
                    typeof (building.rstate_calculate.profit_rate || "-") ===
                    "number"
                      ? building.rstate_calculate.profit_rate.toFixed(1) + "%"
                      : "-"
                  }
                </div>
              </div>
            `;
            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: position,
              content: content,
              map: null,
              yAnchor: 1,
              // Optional: specify the x and y offset of the overlay in relation to the position
            });

            window.kakao.maps.event.addListener(
              marker,
              "mouseover",
              function () {
                customOverlaysRef.current.push(customOverlay);
                customOverlay.setMap(mapRef.current);
              }
            );
            content.addEventListener("click", () => {
              setSidebarID(building.rstate.id);
            });
            content.addEventListener("mouseout", () => {
              customOverlaysRef.current.pop();
              customOverlay.setMap(null);
            });

            window.kakao.maps.event.addListener(marker, "click", function () {
              setSidebarID(building.rstate.id);
            });
            markersRef.current.push(marker);
          });
        } else if (mapRef.current.getLevel() < 2) {
          renderBuilding.forEach((building: IApiData) => {
            const position = new window.kakao.maps.LatLng(
              building.rstate.articleDetail_latitude,
              building.rstate.articleDetail_longitude
            );

            const content = document.createElement("div");
            content.className = "custom-marker-container";
            content.innerHTML = `
            <div class="custom-marker-content">
              <div>
                ${building.rstate.articleDetail_articleName}
              </div>
              <div>
              ${building.rstate.articlePrice_dealPrice.toLocaleString()} 만원
              </div>
              <div class='profit_rate'>
                ${
                  building.rstate_calculate?.profit_rate !== null
                    ? building.rstate_calculate.profit_rate.toFixed(1) + "%"
                    : "-"
                }
              </div>
            </div>
          `;

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: position,
              content: content,
              map: mapRef.current,
              yAnchor: 1,
              // Optional: specify the x and y offset of the overlay in relation to the position
            });
            customOverlaysRef.current.push(customOverlay);

            content.addEventListener("click", () => {
              setSidebarID(building.rstate.id);
            });

            content.addEventListener("mouseenter", () => {
              customOverlay.setZIndex(9999);
            });
            content.addEventListener("mouseleave", () => {
              customOverlay.setZIndex(50);
            });

            customOverlay.setMap(mapRef.current);
          });
        }
      } else {
        setBuildingMap([]);
      }
    }
  }, [selectedBuilding, mapBounds]);

  const handleFilterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === "") return;
    console.log(target.id);
    const updatedFilterData: FilterValuesType = { ...filterData };
    updatedFilterData[target.id].open = !updatedFilterData[target.id].open;
    setFilterData(updatedFilterData);
  };

  const handleRangeChange = (
    filterKey: keyof FilterValuesType,
    rangeType: "min" | "max",
    newValue: string
  ) => {
    setFilterData((prevFilterData: FilterValuesType) => {
      // Copy the current state to avoid direct mutation
      const updatedFilterData: FilterValuesType = { ...prevFilterData };

      // Check if the filter exists and its value is an object with min and max
      const currentFilterValue = updatedFilterData[filterKey].value;
      if (
        currentFilterValue &&
        typeof currentFilterValue === "object" &&
        "min" in currentFilterValue &&
        "max" in currentFilterValue
      ) {
        // Update the min or max value based on rangeType
        updatedFilterData[filterKey].value = {
          ...currentFilterValue,
          [rangeType]: Number(newValue), // Convert newValue to a number
        };
      }

      return updatedFilterData;
    });
  };

  const resetFilterData = async () => {
    setLoadDone(false);

    await getFilterData().then(() => {
      getApiData(1);
    });
  };

  const handleExcelDownload = async () => {
    fetcher
      .get(`profit/export_profit_result_csv`)
      .then((res) => {
        const url = res.data.url;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "profit_result.csv"); // Define the download file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
      })
      .catch((err) => window.alert(err));
  };

  const checkFilterFlag =
    filterData.articleAddition_articleName.open ||
    filterData.lndpclAr.open ||
    filterData.articlePrice_dealPrice.open ||
    filterData.prposArea1Nm.open ||
    filterData.roadSideCodeNm.open ||
    filterData.floor_area_ratio.open ||
    filterData.personal_investment_amount.open ||
    filterData.land_price.open ||
    filterData.profit_rate.open;

  useEffect(() => {
    if (mapRef.current === null) return;
    if (checkFilterFlag !== false) return;

    let body: IBody = {
      sorting: {
        sorting_type: getKeyByValue(SortValues, sidebarSortState.value)!,
        top_n: 1000000,
      },
      filters: {
        articleName_filter: [],
        lndpclAr_filter: [],
        articlePrice_filter: [],
        proposArea1Nm_filter: [],
        roadSideCodeNm_filter: [],
        floor_area_ratio_filter: [],
        personal_investment_amount_filter: [],
        land_price_filter: [],
        profit_rate_filter: [],
      },
    };
    let cnt = 0;
    Object.entries(filterData).map(([key, value]: [key: any, value: any]) => {
      if (value.type === "text") {
        if (value.value.length === value.initialValue.length) {
          cnt++;
          return;
        }
      } else if (value.type === "number") {
        if (
          value.value.min === value.initialValue.min &&
          value.value.max === value.initialValue.max
        ) {
          cnt++;
          return;
        }
      }
      if (value.label === "건물타입") {
        body.filters.articleName_filter = value.value;
      } else if (value.label === "토지면적") {
        let tmp: number[] = []; // Explicitly typing the array as number[]
        tmp.push(value.value.min);
        tmp.push(value.value.max);
        body.filters.lndpclAr_filter = tmp;
      } else if (value.label === "매물가격") {
        let tmp: number[] = [];
        tmp.push(value.value.min);
        tmp.push(value.value.max);
        body.filters.articlePrice_filter = tmp;
      } else if (value.label === "용도지역") {
        body.filters.proposArea1Nm_filter = value.value;
      } else if (value.label === "도로연접") {
        body.filters.roadSideCodeNm_filter = value.value;
      } else if (value.label === "용적율") {
        let tmp: number[] = [];
        tmp.push(value.value.min);
        tmp.push(value.value.max);
        body.filters.floor_area_ratio_filter = tmp;
      } else if (value.label === "자기 투자 금액") {
        let tmp: number[] = [];
        tmp.push(value.value.min);
        tmp.push(value.value.max);
        body.filters.personal_investment_amount_filter = tmp;
      } else if (value.label === "토지가격") {
        let tmp: number[] = [];
        tmp.push(value.value.min);
        tmp.push(value.value.max);
        body.filters.land_price_filter = tmp;
      } else if (value.label === "수익률") {
        let tmp: number[] = [];
        tmp.push(value.value.min);
        tmp.push(value.value.max);
        body.filters.profit_rate_filter = tmp;
      }
    });
    if (cnt === 9) return;
    setLoadDone(false);
    getApiData(1, body);
    // console.log(body);
  }, [checkFilterFlag]);

  return (
    <>
      <main className="w-full h-[calc(100vh-64px)] relative flex flex-row">
        <MapSidebar
          resetFilterData={resetFilterData}
          handleRoadViewClick={setRoadViewCoords}
        />
        <div
          id="map"
          className="w-full h-full"
        >
          <div
            id="roadview"
            className="w-full h-full hidden"
          ></div>
        </div>

        {!loadDone && (
          <div className="absolute z-[100] top-0 left-0 w-full h-full opacity-40 bg-black flex justify-center items-center font-bold text-xl text-white">
            Loading...
          </div>
        )}
        <div className="absolute max-w-[50vw] h-fit overflow-x-scroll right-4 top-4 gap-2 flex flex-row z-40 element-selector">
          {Object.entries(filterData).map(([key, value]) => (
            <div
              className="flex flex-col gap-2 bg-white flex-shrink-0 shadow-md rounded-xl border h-fit box-border"
              key={key}
            >
              <div
                className="flex flex-row gap-2 justify-between text-gray-500 px-4 py-1"
                onClick={handleFilterClick}
                id={key}
              >
                {value.label}
                <Image
                  src={arrowDownSvg}
                  alt="arrowDown"
                  width={16}
                  height={16}
                />
              </div>
              {value.open && value.initialValue && (
                <div className="w-max bg-blue max-h-[200px] overflow-y-scroll pb-2">
                  {value.type === "text"
                    ? Array.isArray(value.initialValue) &&
                      value.initialValue.map((val: string) => (
                        <div
                          className="flex flex-row gap-2 items-center px-4 box-border"
                          key={val}
                        >
                          <input
                            type="checkbox"
                            id={val}
                            value={val}
                            checked={
                              Array.isArray(value.value) &&
                              value.value.includes(val)
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFilterData((prevFilterData: any) => {
                                const updatedFilterData = {
                                  ...prevFilterData,
                                };
                                const currentFilterValue =
                                  updatedFilterData[key].value;
                                if (Array.isArray(currentFilterValue)) {
                                  if (checked) {
                                    updatedFilterData[key].value = [
                                      ...currentFilterValue,
                                      val,
                                    ];
                                  } else {
                                    updatedFilterData[key].value =
                                      currentFilterValue.filter(
                                        (v) => v !== val
                                      );
                                  }
                                }
                                return updatedFilterData;
                              });
                            }}
                          />
                          <label
                            htmlFor={val}
                            className="block"
                          >
                            {val}
                          </label>
                        </div>
                      ))
                    : typeof value.value === "object" &&
                      value.type === "number" &&
                      value.value !== null &&
                      "min" in value.value &&
                      "max" in value.value && (
                        <div className="flex gap-2 px-4">
                          <input
                            type="number"
                            value={value.value.min}
                            onChange={(e) =>
                              handleRangeChange(key, "min", e.target.value)
                            }
                            className="w-16 rounded border-b text-center"
                          />
                          <span>~</span>
                          <input
                            type="number"
                            value={value.value.max}
                            onChange={(e) =>
                              handleRangeChange(key, "max", e.target.value)
                            }
                            className="w-16 rounded border-b text-center"
                          />
                        </div>
                      )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute right-4 bottom-4 z-50 flex flex-row gap-2">
          <div
            onClick={handleExcelDownload}
            className="w-fit h-8 px-4 bg-white shadow-md rounded-md flex items-center justify-center cursor-pointer"
          >
            엑셀 다운로드
          </div>
          <div
            className="w-24 h-8 bg-white shadow-md rounded-md flex items-center justify-center cursor-pointer"
            onClick={handleMapChangetoDistrict}
          >
            지적편집도
          </div>
          <div
            className="w-24 h-8 bg-white shadow-md rounded-md flex items-center justify-center cursor-pointer"
            onClick={handleMapChangetoRoad}
          >
            일반지도
          </div>
        </div>
      </main>
    </>
  );
}
