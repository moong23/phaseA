export interface ICardBuildingData {
  articleDetail_articleName: string;
  prposArea1Nm: string;
  // tpgrphHgCodeNm: "평지" | "고지" | "급경사" | "완경사" | "지정되지않음";
  tpgrphHgCodeNm: string;
  articleDetail_sectionName: string;
  profitRate: string;
  articleDetail_exposureAddress?: string;
  articleDetail_articleConfirmYMD?: string;
  articleDetail_pnu?: string;
  articleAddition_floorInfo?: string;
  articleDetail_etcAddress?: string;
  articlePrice_dealPrice?: string;
}
