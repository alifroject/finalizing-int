import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
          Welcome to the App!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-xl">
          This is your homepage. You can use the sidebar or navbar to navigate to other pages like "Find People" or "Profile".
        </p>
      </div>
    </>
  );
}
