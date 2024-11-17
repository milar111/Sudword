import SudWord from "@/components/SudWord";
import Image from "next/image";

export default function Home() {

  return (
    <main className="custom-cursor flex flex-col justify-center items-center overflow-hidden mx-auto sm:px-10 px-5 h-screen bg-white">
      <SudWord/>
    </main>
  );
}
