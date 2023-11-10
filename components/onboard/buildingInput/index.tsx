"use client";

import CustomInput from "@/components/Input";
import { useEffect } from "react";
import { ICalcData } from "@/interfaces/calcData";
import { useRecoilState } from "recoil";
import { calcRecoilData } from "@/state/atom";
import { DEFAULT_CALC_DATA } from "@/constants/calcData";

const TabTitle = `text-base font-semibold p-2`;
const ContentTitle = `text-lg font-bold basis-[70px]`;
const ContentValue = `flex flex-col gap-2`;
const ContentSemiTitle = `text-base font-semibold`;

const calcResetData = {
  groundData: {
    Costs: {
      AcquisitionPrice: "",
      DesignSupervisionPrice: "",
    },
    Volume: "",
    Design: "",
    Supervision: "",
    Construction: "",
  },
  Expenses: "",
  Loans: {
    Ground: "",
    Construction: "",
    ConstructSelf: "",
    Interest: "",
  },
};

const BuildingInput = () => {
  const [calcData, setCalcData] = useRecoilState<ICalcData>(calcRecoilData);

  useEffect(() => {
    console.log(calcData);
  }, [calcData]);
  return (
    <div className="w-auto flex flex-col gap-12 pb-12">
      <div className="w-full flex justify-between">
        <div className="text-3xl font-bold">건물 인풋값</div>
        <div className="flex gap-4 ">
          <div
            onClick={() => setCalcData(calcResetData)}
            className="bg-slate-600 px-4 py-2 text-white rounded-lg"
          >
            초기화
          </div>
          <div
            onClick={() => setCalcData(DEFAULT_CALC_DATA)}
            className={`${
              DEFAULT_CALC_DATA === calcData
                ? "cursor-default bg-slate-600"
                : "cursor-pointer bg-blue-400"
            }
          px-4 py-2 text-white rounded-lg`}
          >
            기본값 사용하기
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col bg-white rounded-3xl px-16 py-10 shadow-md">
        <div className={`${TabTitle}`}>지출</div>
        <div className="w-[800px] h-[1px] border border-gray-300" />

        <div className="w-full py-6 px-2 flex flex-row justify-start gap-10">
          <div className={`${ContentTitle}`}>토지비용</div>
          <div className={`${ContentValue}`}>
            <div className={`${ContentSemiTitle}`}>제비용</div>
            <div className="flex flex-row gap-10 mb-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-400">매입비 관련 제비용</div>
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="매입비 관련 제비용 입력"
                    value={calcData.groundData.Costs.AcquisitionPrice}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        groundData: {
                          ...prevCalcData.groundData,
                          Costs: {
                            ...prevCalcData.groundData.Costs,
                            AcquisitionPrice: newValue,
                          },
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-400">설계비 관련 제비용</div>
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="설계비 관련 제비용 입력"
                    value={calcData.groundData.Costs.DesignSupervisionPrice}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        groundData: {
                          ...prevCalcData.groundData,
                          Costs: {
                            ...prevCalcData.groundData.Costs,
                            DesignSupervisionPrice: newValue,
                          },
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
            </div>
            <div className={`${ContentSemiTitle}`}>연면적</div>
            <div className="flex flex-row gap-10 mb-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-400">실제 용적율</div>
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="실제 용적율 입력"
                    value={calcData.groundData.Volume}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        groundData: {
                          ...prevCalcData.groundData,
                          Volume: newValue,
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className={`${ContentSemiTitle} basis-[295px]`}>설계비</div>
              <div className={`${ContentSemiTitle}`}>감리비</div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="설계비 입력"
                    value={calcData.groundData.Design}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        groundData: {
                          ...prevCalcData.groundData,
                          Design: newValue,
                        },
                      }));
                    }}
                  />
                  원/평
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="감리비 입력"
                    value={calcData.groundData.Supervision}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        groundData: {
                          ...prevCalcData.groundData,
                          Supervision: newValue,
                        },
                      }));
                    }}
                  />
                  원/평
                </div>
              </div>
            </div>
            <div className={`${ContentSemiTitle}`}>공사비</div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="공사비 입력"
                    value={calcData.groundData.Construction}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        groundData: {
                          ...prevCalcData.groundData,
                          Construction: newValue,
                        },
                      }));
                    }}
                  />
                  원/평
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-[800px] h-[1px] border border-gray-200" /> */}
        <div className="w-full py-6 px-2 flex flex-row justify-start gap-10">
          <div className={`${ContentTitle}`}>제경비</div>
          <div className={`${ContentValue}`}>
            <div className={`${ContentSemiTitle}`}>제경비용</div>
            <div className="flex flex-row gap-10 mb-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="제경비율 입력"
                    value={calcData.Expenses}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        Expenses: newValue,
                      }));
                    }}
                  />
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${TabTitle}`}>자기자본</div>
        <div className="w-[800px] h-[1px] border border-gray-300" />
        <div className="w-full py-6 px-2 flex flex-row justify-start gap-10">
          <div className={`${ContentTitle}`}>대출비용</div>
          <div className={`${ContentValue}`}>
            <div className={`${ContentSemiTitle}`}>토지대출</div>
            <div className="flex flex-row gap-10 mb-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="토지대출 비율 입력"
                    value={calcData.Loans.Ground}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        Loans: {
                          ...prevCalcData.Loans,
                          Ground: newValue,
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className={`${ContentSemiTitle} basis-[295px]`}>
                공사비 대출
              </div>
              <div className={`${ContentSemiTitle}`}>공사비 자기 대출</div>
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="공사비 대출 비율 입력"
                    value={calcData.Loans.Construction}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        Loans: {
                          ...prevCalcData.Loans,
                          Construction: newValue,
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="공사비 자기 대출 비율 입력"
                    value={calcData.Loans.ConstructSelf}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        Loans: {
                          ...prevCalcData.Loans,
                          ConstructSelf: newValue,
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
            </div>
            <div className={`${ContentSemiTitle}`}>대출이자</div>
            <div className="flex flex-row gap-10 mb-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CustomInput
                    px={4}
                    py={2}
                    placeholder="이자 비율 입력"
                    value={calcData.Loans.Interest}
                    onChange={(newValue) => {
                      setCalcData((prevCalcData) => ({
                        ...prevCalcData,
                        Loans: {
                          ...prevCalcData.Loans,
                          Interest: newValue,
                        },
                      }));
                    }}
                  />
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingInput;
