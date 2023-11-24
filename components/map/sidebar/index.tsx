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
import { buildingOnView, sidebarRecoilData, sidebarSort } from "@/state/atom";
import { fetcher } from "@/api/fetcher";

const detailLine = "w-full flex flex-row gap-6";
const detailLeftCls = "font-semibold whitespace-nowrap";
const detailRightCls = "font-normal text-gray-400 whitespace-nowrap";

const DummyData: ICardBuildingData[] = [
  {
    articleDetail_articleName: "상가건물",
    prposArea1Nm: "일반 상업 지역",
    tpgrphHgCodeNm: "평지",
    articleDetail_sectionName: "신문로 2가",
    profitRate: "string",
    articleDetail_exposureAddress: "서울시 종로구 신문로 2가",
  },
];

const MapSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarType, setSidebarType] = useState(0);
  const [sidebarID, setSidebarID] = useRecoilState(sidebarRecoilData);
  const buildingData = useRecoilValue(buildingOnView);
  const [selectedBuilidng, setSelectedBuilding] = useState<any>();
  const [sortStatus, setSortStatus] = useRecoilState(sidebarSort);

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

  const handleCardClick = (id?: string) => {
    if (sidebarType === 0 && id) {
      console.log(id);
      setSidebarID(Number(id));
    }
    setSidebarType((prev) => 1 - prev);
  };

  useEffect(() => {
    if (sidebarID === -1) return;

    setSidebarOpen(true);
    setSidebarType(1);
    fetcher.get(`rstate/${sidebarID}`).then((res) => {
      console.log(res.data);
      setSelectedBuilding(res.data);
    });
  }, [sidebarID]);

  return (
    <>
      <style jsx>{`
        #cardArea > div:last-child > #borderLine {
          border: none;
        }
      `}</style>
      {sidebarOpen && (
        <aside className="h-full min-w-[529px] border-r border-r-gray-400 bg-white absolute left-0 z-30 pt-[120px] px-16 shadow-lg flex flex-col">
          {sidebarType === 0 ? (
            <>
              <div className="flex flex-row gap-2 items-center">
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
                className="h-full flex flex-col overflow-y-scroll gap-3"
              >
                {buildingData.map((building: any) => (
                  <div key={building.articleDetail_articleNo}>
                    <ResultCard
                      buildingData={building}
                      onClick={() => handleCardClick(building.id)}
                    />
                    <div
                      id="borderLine"
                      className="w-full h-[1px] border border-gray-200 mt-3"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            selectedBuilidng && (
              <div className="w-full flex flex-col">
                <ResultCard
                  buildingData={selectedBuilidng}
                  onClick={() => handleCardClick()}
                  type={sidebarType}
                />
                <div className="w-full h-[1px] border border-gray-200 my-4" />
                <div className="w-full flex flex-col gap-4">
                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물타입</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_articleName} */}
                        {selectedBuilidng.articleDetail_articleName}
                      </div>
                    </div>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물허가일자</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_articleConfirmYMD} */}
                        {selectedBuilidng.articleDetail_articleConfirmYMD}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물 pnu</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_pnu} */}
                        {selectedBuilidng.articleDetail_pnu}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>층수정보</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleAddition_floorInfo} */}
                        {selectedBuilidng.articleAddition_floorInfo}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물 상세 주소</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articleDetail_exposureAddress}{" "}
                        {dummyBuildingData[2].articleDetail_etcAddress || ""} */}
                        {selectedBuilidng.articleDetail_exposureAddress}{" "}
                        {selectedBuilidng.articleDetail_etcAddress || ""}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>건물매매가총액</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].articlePrice_dealPrice} */}
                        {Number(
                          selectedBuilidng.articlePrice_dealPrice
                        ).toLocaleString()}
                        (천원)
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>토지면적</div>
                      <div className={`${detailRightCls}`}>
                        {/* {dummyBuildingData[0].lndpclAr} */}
                        {selectedBuilidng.lndpclAr}m<sup>2</sup>
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className="flex flex-row gap-6">
                        <div className={`${detailLeftCls}`}>용도지역</div>
                        <div className={`${detailRightCls}`}>
                          {/* {dummyBuildingData[2].prposArea1Nm} */}
                          {selectedBuilidng.prposArea1Nm}
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
                        {selectedBuilidng.tpgrphHgCodeNm} |{" "}
                        {selectedBuilidng.tpgrphFrmCodeNm} |{" "}
                        {selectedBuilidng.roadSideCodeNm}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>평당 건물가격</div>
                      <div className={`${detailRightCls}`}>
                        {Number(
                          dummyBuildingData[0].buildingPricePerSqft
                        ).toLocaleString()}
                        (천원)
                        {/* {selectedBuilidng.buildingPricePerSqft} */}
                      </div>
                    </div>
                    <div className="flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>용적율</div>
                      <div className={`${detailRightCls}`}>
                        {dummyBuildingData[0].floorAreaRatio}
                        {/* {selectedBuilidng.floorAreaRatio} */}
                      </div>
                    </div>
                  </div>

                  <div className={`${detailLine}`}>
                    <div className="basis-2/5 flex flex-row gap-6">
                      <div className={`${detailLeftCls}`}>평당 토지가격</div>
                      <div className={`${detailRightCls}`}>
                        {Number(
                          dummyBuildingData[0].groundPrice
                        ).toLocaleString()}
                        (천원)
                        {/* {selectedBuilidng.groundPrice} */}
                      </div>
                    </div>
                  </div>
                  <div className={`${detailLine}`}>
                    <div className="flex flex-row gap-6">
                      <div className="basis-2/5 flex flex-row gap-6">
                        <div className={`${detailLeftCls}`}>자기투자금액</div>
                        <div className={`${detailRightCls}`}>
                          {Number(
                            dummyBuildingData[0].selfInvestmentPrice
                          ).toLocaleString()}
                          (천원)
                          {/* {selectedBuilidng.selfInvestmentPrice}(천원) */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </aside>
      )}
      <div
        className={`${sidebarOpen ? "ml-[529px]" : "ml-0"} 
      absolute w-12 h-20 bg-white top-1/2 z-20 border border-black border-l-0 rounded-r-lg shadow-md translate-y-[-50%] flex items-center justify-center cursor-pointer`}
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <Image
          src={foldLeftSvg}
          alt="foldIcon"
          width={36}
          height={36}
          className={`${!sidebarOpen ? "transform rotate-180" : ""}`}
        />
      </div>
    </>
  );
};

export default MapSidebar;
