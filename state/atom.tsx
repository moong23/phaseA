import { atom } from "recoil";
import { DEFAULT_CALC_DATA } from "@/constants/calcData";

export const calcRecoilData = atom({
  key: "calcData",
  default: DEFAULT_CALC_DATA,
});

export const searchRecoilData = atom({
  key: "searchData",
  default: "",
});

export const sidebarRecoilData = atom({
  key: "sidebarData",
  default: -1,
});

export const buildingOnView = atom({
  key: "buildingOnView",
  default: [],
});

export const sidebarSort = atom({
  key: "sidebarSort",
  default: {
    status: false,
    value: "토지 가격",
  },
});
