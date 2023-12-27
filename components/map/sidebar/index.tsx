"use client";

import foldDownSvg from "@/assets/arrow-down.svg";
import foldLeftSvg from "@/assets/arrow-left.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ResultCard from "./resultCard";
import { ICardBuildingData } from "@/interfaces/sidebar";
import { SortValues } from "@/constants/mapData";
import { dummyBuildingData } from "@/dummy/dummyBuilding";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  buildingInMap,
  buildingOnView,
  sidebarRecoilData,
  sidebarSort,
} from "@/state/atom";
import { fetcher } from "@/api/fetcher";
import { IApiData, IApiIndivData } from "@/interfaces/calcData";
import Link from "next/link";

const detailLine = "w-full flex flex-row gap-6";
const detailLeftCls = "font-semibold whitespace-nowrap";
const detailRightCls = "font-normal text-gray-400 whitespace-nowrap";

interface ISidebarProps {
  handleRoadViewClick: ({ lat, lng }: { lat: number; lng: number }) => void;
  resetFilterData: () => void;
}

const MapSidebar = ({
  resetFilterData,
  handleRoadViewClick,
}: ISidebarProps) => {
  const [sidebarType, setSidebarType] = useState(0);
  const [sidebarID, setSidebarID] = useRecoilState(sidebarRecoilData);
  const buildingData = useRecoilValue(buildingOnView);
  const [selectedBuilidng, setSelectedBuilding] = useState<IApiIndivData>();
  const buildingMap = useRecoilValue(buildingInMap);
  const [sortStatus, setSortStatus] = useRecoilState(sidebarSort);
  const [lastUpdate, setLastUpdate] = useState("");

  const handleSortChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetText = e.currentTarget.innerText;
    const targetKey = e.currentTarget.getAttribute(
      "data-key"
    ) as keyof typeof SortValues;

    if (targetText === sortStatus.value) {
      setSortStatus((prev) => ({ ...prev, status: !prev.status }));
      return;
    }
    setSortStatus({ status: false, value: SortValues[targetKey] });
  };

  const handleCardClick = (id?: number) => {
    if (sidebarType === 0 && id) {
      console.log(id);
      setSidebarID(id);
    }
    setSidebarType((prev) => 1 - prev);
  };

  const resetFilter = () => {
    resetFilterData();
  };
  useEffect(() => {
    if (sidebarID === -1) return;

    setSidebarType(1);
    fetcher.get(`rstate/${sidebarID}`).then((res) => {
      console.log(res.data);
      setSelectedBuilding(res.data);
    });
  }, [sidebarID]);

  useEffect(() => {
    fetcher.get(`rstate/last_update/`).then((res) => {
      setLastUpdate(res.data.last_update);
    });
  }, []);

  return (
    <>
      <style jsx>{`
        #cardArea > div:last-child > #borderLine {
          border: none;
        }
      `}</style>
      {
        <aside
          className={`${
            sidebarType === 0 ? "w-[400px]" : "w-fit"
          } h-full flex-shrink-0 border-r border-r-gray-400 bg-white z-30 pt-10 px-16 shadow-lg flex flex-col`}
        >
          {lastUpdate !== "" && (
            <div className="text-lg font-semibold mb-10">
              데이터 업데이트: {lastUpdate}
            </div>
          )}
          {sidebarType === 0 ? (
            buildingMap.length === 0 ? (
              <div className="flex flex-col gap-4">
                <span>지도에 표시되는 데이터가 없습니다.</span>
                <button
                  className="w-full h-12 bg-red-200 rounded-2xl "
                  onClick={() => resetFilter()}
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-row gap-2 items-center ">
                  <div
                    className="font-semibold cursor-pointer "
                    onClick={() =>
                      setSortStatus((prev) => ({
                        ...prev,
                        status: !prev.status,
                      }))
                    }
                  >
                    Sort by
                  </div>
                  <Image
                    className="cursor-pointer "
                    src={foldDownSvg}
                    alt="arrow Icon"
                    width={16}
                    height={16}
                    onClick={() =>
                      setSortStatus((prev) => ({
                        ...prev,
                        status: !prev.status,
                      }))
                    }
                  />
                  {sortStatus.value !== "" && (
                    <div className="px-2 bg-slate-200 rounded-md py-1 ml-4">
                      {sortStatus.value}
                    </div>
                  )}
                </div>
                {sortStatus.status && (
                  <div className="absolute mt-8 w-[200px] p-4 rounded-xl bg-white z-40 flex flex-col gap-2 shadow-md">
                    {Object.entries(SortValues).map(([key, value]) => (
                      <div
                        key={key}
                        data-key={key}
                        className="w-full h-8 flex flex-row items-center px-4 rounded-md hover:bg-gray-100 "
                        onClick={handleSortChange}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                )}
                <div className="w-1 h-8" />
                <div
                  id="cardArea"
                  className="h-full flex flex-col overflow-y-scroll gap-3 overflow-x-hidden"
                >
                  {buildingMap.map((building: IApiData) => {
                    return (
                      <div key={building.rstate.id}>
                        <ResultCard
                          buildingData={building}
                          onClick={() => handleCardClick(building.rstate.id)}
                        />
                        <div
                          id="borderLine"
                          className="w-full h-[1px] border border-gray-200 mt-3"
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )
          ) : (
            selectedBuilidng && (
              <div className="w-full flex flex-col">
                <ResultCard
                  buildingData={selectedBuilidng}
                  onClick={() => handleCardClick()}
                  type={sidebarType}
                  handleRoadViewClick={handleRoadViewClick}
                />
                <div className="w-full h-[1px] border border-gray-200 my-4" />
                <div className="w-full flex flex-col gap-4">
                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물타입</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_articleName} */}
                        {selectedBuilidng.rstate.articleDetail_articleName}
                      </div>
                    </div>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물허가일자</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_articleConfirmYMD} */}
                        {selectedBuilidng.rstate
                          .articleFacility_buildingUseAprvYmd || "-"}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물 pnu</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_pnu} */}
                        {selectedBuilidng.rstate.articleDetail_pnu}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>층수정보</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleAddition_floorInfo} */}
                        {selectedBuilidng.rstate.articleAddition_floorInfo}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물 상세 주소</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_exposureAddress}{" "}
                        {dummyBuildingData[2].articleDetail_etcAddress || ""} */}
                        {selectedBuilidng.rstate.articleDetail_exposureAddress}{" "}
                        {selectedBuilidng.rstate.articleDetail_etcAddress || ""}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물매매가총액</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articlePrice_dealPrice} */}
                        {selectedBuilidng.rstate.articlePrice_dealPrice.toLocaleString()}
                        (만원)
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>토지면적</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].lndpclAr} */}
                        {selectedBuilidng.rstate.lndpclAr}m<sup>2</sup>
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className="flex flex-row gap-6">
                        <div className={`${detailLeftCls}`}>용도지역</div>
                        <div className={`${detailRightCls}`}>
                          {/* {dummyBuildingData[2].prposArea1Nm} */}
                          {selectedBuilidng.rstate.prposArea1Nm}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>토지타입</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].tpgrphHgCodeNm} |{" "}
                        {dummyBuildingData[0].tpgrphFrmCodeNm} |{" "}
                        {dummyBuildingData[0].roadSideCodeNm} */}
                        {selectedBuilidng.rstate.tpgrphHgCodeNm} |{" "}
                        {selectedBuilidng.rstate.tpgrphFrmCodeNm} |{" "}
                        {selectedBuilidng.rstate.roadSideCodeNm}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>평당 건물가격</div>
                      <div className={`${detailRightCls}`}>
                        {selectedBuilidng.rstate_calculate.building_unit_price.toLocaleString()}
                        (만원)
                        {/* {selectedBuilidng.buildingPricePerSqft} */}
                      </div>
                    </div>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>용적율</div>
                      <div className={`${detailRightCls}`}>
                        {selectedBuilidng.rstate_calculate.floor_area_ratio *
                          100}
                        %{/* {selectedBuilidng.floorAreaRatio} */}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>평당 토지가격</div>
                      <div className={`${detailRightCls}`}>
                        {selectedBuilidng.rstate_calculate.land_price.toLocaleString()}
                        (만원)
                        {/* {selectedBuilidng.groundPrice} */}
                      </div>
                    </div>
                  </div>
                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className="basis-2/5 flex flex-row gap-6">
                        <div className={`${detailLeftCls}`}>자기투자금액</div>
                        <div className={`${detailRightCls}`}>
                          {(
                            selectedBuilidng.rstate_calculate
                              .personal_investment_amount || 0
                          ).toLocaleString()}
                          (천원)
                          {/* {selectedBuilidng.selfInvestmentPrice}(천원) */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className="basis-2/5 flex flex-row gap-6">
                        <Link
                          href={`${selectedBuilidng.rstate.articleExistTabs}`}
                          target="_blank"
                          className={`${detailLeftCls} hover:text-blue-600`}
                        >
                          네이버 매물 링크
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </aside>
      }
    </>
  );
};

export default MapSidebar;
