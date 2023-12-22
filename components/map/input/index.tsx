import searchIconSvg from "@/assets/search-normal.svg";
import { searchRecoilData } from "@/state/atom";
import Image from "next/image";
import { useRecoilState } from "recoil";

const MapInput = () => {
  const [searchVal, setSearchVal] = useRecoilState(searchRecoilData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const handleClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.type === "keydown" && e.key !== "Enter") return;
    console.log(searchVal);
  };
  return (
    <div className="absolute flex flex-row top-8 left-12 w-[304px] h-12 z-50 bg-white rounded-lg shadow-md border px-4">
      <input
        placeholder="건물명, 지번, 도로명 검색"
        className="w-full h-full focus:outline-none"
        value={searchVal}
        onChange={handleChange}
        onKeyDown={handleClick}
      />
      <Image
        src={searchIconSvg}
        alt="searchIcon"
        width={16}
        height={16}
      />
    </div>
  );
};

export default MapInput;
