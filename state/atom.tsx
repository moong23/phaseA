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
