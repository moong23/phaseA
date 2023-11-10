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
