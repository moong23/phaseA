import { IApiData, IApiIndivData } from "@/interfaces/calcData";
import { useEffect } from "react";
const ResultCard = ({
  buildingData,
  onClick,
  type,
}: {
  buildingData: IApiData;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  type?: number;
}) => {
  return buildingData ? (
    <div
      onClick={onClick}
      className="w-[400px] flex flex-row justify-between cursor-pointer"
    >
      <div className="h-24 flex-shrink-0 flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <div className="px-2 py-1 bg-sky-200 rounded-xl text-blue-600 text-sm">
            {buildingData.rstate.articleDetail_articleName}
          </div>
          <div className="text-gray-600 font-medium">
            {buildingData.rstate.prposArea1Nm} |{" "}
            {buildingData.rstate.tpgrphHgCodeNm}
          </div>
        </div>
        <div className="flex items-center flex-row gap-2">
          <div className="text-md font-semibold text-gray-600">
            {buildingData.rstate.articleDetail_sectionName}
          </div>
          <div className="text-xl font-semibold">
            수익률{" "}
            {buildingData.rstate_calculate.profit_rate
              ? buildingData.rstate_calculate.profit_rate.toFixed(1)
              : ""}
            %
          </div>
        </div>
        {type === 1 && (
          <div className="flex text-gray-400 font-normal">
            {buildingData.rstate.articleDetail_exposureAddress}
          </div>
        )}
      </div>

      <div className="w-24 h-24 bg-gray-400 my-2"></div>
    </div>
  ) : (
    <></>
  );
};

export default ResultCard;
