import { TopbarElement } from "@/constants/topbarElement";
import Link from "next/link";

const Topbar = () => {
  return (
    <header className="w-full h-16 bg-white flex justify-between items-center px-10 border border-b-gray-200">
      <div className="text-lg font-bold">페이즈에이 건축</div>
      <div className="flex flex-row items-center gap-10">
        {Object.entries(TopbarElement).map(([key, value], index) => (
          <Link
            href={`/auth/${key}`}
            key={index}
            className="text-lg font-bold"
          >
            {value}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Topbar;
