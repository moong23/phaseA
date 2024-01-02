"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainPage = () => {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    localStorage.removeItem("auth");
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id === "phaseA" && password === "phaseA_Account") {
      localStorage.setItem("auth", "true");
      router.push("/auth/map");
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };
  return (
    <div className="w-full h-[calc(100vh-64px)] flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit}
        >
          <input
            type="ID"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="ID"
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;
