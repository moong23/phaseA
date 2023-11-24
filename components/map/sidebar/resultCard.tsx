import { ICardBuildingData } from "@/interfaces/sidebar";
import { useEffect } from "react";
const ResultCard = ({
  buildingData,
  onClick,
  type,
}: {
  buildingData: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  type?: number;
}) => {
  return (
    <div
      onClick={onClick}
      className="w-[400px] flex flex-row justify-between cursor-pointer"
    >
      <div className="h-24 flex-shrink-0 flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <div className="px-2 py-1 bg-sky-200 rounded-xl text-blue-600 text-sm">
            {buildingData.articleDetail_articleName}
          </div>
          <div className="text-gray-600 font-medium">
            {buildingData.prposArea1Nm} | {buildingData.tpgrphHgCodeNm}
          </div>
        </div>
        <div className="flex items-center flex-row gap-2">
          <div className="text-md font-semibold text-gray-600">
            {buildingData.articleDetail_sectionName}
          </div>
          <div className="text-xl font-semibold">
            수익률 {buildingData.profitRate}
          </div>
        </div>
        {type === 1 && (
          <div className="flex text-gray-400 font-normal">
            {buildingData.articleDetail_exposureAddress}
          </div>
        )}
      </div>

      <div className="w-24 h-24 bg-gray-400 my-2"></div>
    </div>
  );
};

export default ResultCard;
