export interface ICalcData {
  groundData: {
    // 토지비용
    /**
     * 제비용
     * @AcquisitionPrice 토지 매입비 관련 제비용
     * @DesignSupervisionPrice 설계비, 감리비 관련 제비용
     */
    Costs: {
      AcquisitionPrice: string;
      DesignSupervisionPrice: string;
    };
    /**
     * 실제 용적율
     */
    Volume: string;
    /** 설계비 */
    Design: string;
    /** 감리비 */
    Supervision: string; // 감리비
    /** 공사비 */
    Construction: string; // 공사비
  };
  /** 제경비 */
  Expenses: string;
  /**
   * 대출
   * @Ground 토지대출
   * @Construction 공사대출
   * @ConstructSelf 공사비 자기 대출
   * @Interest 대출이자
   */
  Loans: {
    Ground: string;
    Construction: string;
    ConstructSelf: string;
    Interest: string;
  };
}
export interface IApiData {
  rstate: {
    id: number;
    articleDetail_articleName: string;
    articleDetail_latitude: number;
    articleDetail_longitude: number;
    articleDetail_exposureAddress: string;
    articleAddition_area1: number;
    prposArea1Nm: string;
    tpgrphHgCodeNm: string;
    articleDetail_sectionName: string;
  };
  rstate_calculate: {
    pnu: string;
    building_unit_price: number;
    land_price: number;
    profit_rate: number;
    floor_area: number;
    floor_area_ratio: number;
    id: number;
    personal_investment_amount: number;
  };
  dong_price: string;
}
export interface IApiIndivData {
  rstate: {
    articleDetail_sectionName: string;
    articlePrice_dealPrice: number;
    roadSideCodeNm: string;
    articleDetail_articleNo: number;
    articleDetail_etcAddress: string | null;
    articleBuildingRegister_jiyukNm: string | null;
    lastUpdtDt: string;
    articleDetail_exposureAddress: string;
    articleExistTabs: string;
    articleDetail_articleName: string;
    articleAddition_floorInfo: string | null;
    pnu: string;
    articleDetail_articleConfirmYMD: string;
    articleAddition_area1: number;
    lndpclAr: number;
    articleDetail_latitude: number;
    articleDetail_longitude: number;
    articleFacility_buildingUseAprvYmd: string;
    prposArea1Nm: string;
    id: number;
    articleFloor_correspondingFloorCount: string;
    tpgrphHgCodeNm: string;
    articleDetail_pnu: number;
    tpgrphFrmCodeNm: string;
  };
  rstate_calculate: {
    pnu: string;
    building_unit_price: number;
    land_price: number;
    profit_rate: number;
    floor_area: number;
    floor_area_ratio: number;
    id: number;
    personal_investment_amount: number;
  };
  dong_price: string;
}
