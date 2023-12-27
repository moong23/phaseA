import { IApiData, IApiIndivData } from "@/interfaces/calcData";
import Image from "next/image";
import { useEffect } from "react";
import RoadViewSrc from "@/assets/roadview.png";
const ResultCard = ({
  buildingData,
  onClick,
  type,
  handleRoadViewClick,
}: {
  buildingData: IApiData;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  type?: number;
  handleRoadViewClick?: ({ lat, lng }: { lat: number; lng: number }) => void;
}) => {
  const handleClickRoadView = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleRoadViewClick?.({
      lat: buildingData.rstate.articleDetail_latitude,
      lng: buildingData.rstate.articleDetail_longitude,
    });
  };

  return buildingData ? (
    <div
      onClick={onClick}
      className="w-full flex flex-row justify-between cursor-pointer items-center"
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
            {buildingData.rstate_calculate
              ? typeof (buildingData.rstate_calculate.profit_rate || "-") ===
                "number"
                ? buildingData.rstate_calculate.profit_rate.toFixed(1) + "%"
                : "-"
              : ""}
          </div>
        </div>
        {type === 1 && (
          <div className="flex text-gray-400 font-normal">
            {buildingData.rstate.articleDetail_exposureAddress}
          </div>
        )}
      </div>
      {type === 1 && (
        <div
          onClick={handleClickRoadView}
          className="h-[64px] w-[64px] flex-shrink-0 relative flex items-center rounded-md hover:bg-slate-200"
        >
          <Image
            src={RoadViewSrc}
            alt="roadViewSrc"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ResultCard;
