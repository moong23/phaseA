"use client";

import { ICalcData } from "@/interfaces/calcData";
import { calcRecoilData } from "@/state/atom";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import checkSrc from "@/assets/Group 10599.svg";
import { useRouter } from "next/navigation";

const Button = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: (e: any) => void;
}) => {
  return (
    <div
      className={`${disabled ? "bg-gray-200" : "bg-blue-200 cursor-pointer"}
      h-[75px] rounded-3xl flex justify-center items-center`}
      onClick={onClick}
    >
      <div className="text-2xl text-white font-bold whitespace-break-spaces">
        ✈️ {""} 다음으로
      </div>
    </div>
  );
};

const OnBoardSidebar = () => {
  const calcData = useRecoilValue(calcRecoilData);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Define a function to count truthy values in an object recursively
    function countTruthyValues(obj: ICalcData): number {
      return Object.values(obj).reduce((acc, cur) => {
        if (typeof cur === "object" && cur !== null) {
          // Recurse into nested objects
          return acc + countTruthyValues(cur);
        } else {
          // Count if truthy
          return acc + (cur ? 1 : 0);
        }
      }, 0);
    }

    // Use the function on your calcData object
    const progress = countTruthyValues(calcData);

    setProgress(progress);
  }, [calcData]);

  const contentTitle = "text-sm font-semibold";
  const contentValue = "bg-gray-100 px-4 py-2 rounded-lg flex justify-between";

  return (
    <div className="w-[320px] flex flex-col gap-3.5">
      <Button
        disabled={progress !== 11}
        onClick={() => router.push("/map")}
      />
      <div className="w-full bg-white rounded-3xl flex flex-col gap-4 p-10">
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold">🏃🏻 인풋 완성도</div>
          <div className="basis-[40px] rounded-md bg-sky-200 px-4 py-1">
            {Math.round((progress / 11) * 100)}%
          </div>
        </div>
        <div className="w-full bg-sky-200 rounded-md overflow-hidden">
          <div
            className="bg-sky-400 h-2"
            style={{ width: `${(progress / 11) * 100}%` }}
          />
        </div>
        <div className="w-full h-[1px] border border-b-gray-100 my-2" />
        <div className="w-full flex flex-col gap-4">
          <div className={contentTitle}>지출</div>
          <div className={contentValue}>
            제비용
            {calcData.groundData.Costs.AcquisitionPrice &&
              calcData.groundData.Costs.DesignSupervisionPrice && (
                <Image
                  src={checkSrc}
                  alt="checkIcon"
                />
              )}
          </div>
          <div className={contentValue}>
            실제 용적율
            {calcData.groundData.Volume && (
              <Image
                src={checkSrc}
                alt="checkIcon"
              />
            )}
          </div>
          <div className={contentValue}>
            설계비 · 감리비 · 공사비
            {calcData.groundData.Design &&
              calcData.groundData.Supervision &&
              calcData.groundData.Construction && (
                <Image
                  src={checkSrc}
                  alt="checkIcon"
                />
              )}
          </div>
          <div className={contentValue}>
            제경비
            {calcData.Expenses && (
              <Image
                src={checkSrc}
                alt="checkIcon"
              />
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className={contentTitle}>자기자본</div>
          <div className={contentValue}>
            토지대출
            {calcData.Loans.Ground && (
              <Image
                src={checkSrc}
                alt="checkIcon"
              />
            )}
          </div>
          <div className={contentValue}>
            공사비 대출 · 자기 대출
            {calcData.Loans.Construction && calcData.Loans.ConstructSelf && (
              <Image
                src={checkSrc}
                alt="checkIcon"
              />
            )}
          </div>
          <div className={contentValue}>
            대출이자
            {calcData.Loans.Interest && (
              <Image
                src={checkSrc}
                alt="checkIcon"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardSidebar;
