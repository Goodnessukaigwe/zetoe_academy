import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center mb-6 sm:mb-8">
      <Image
        src="/zetoe/zetelog.png"
        alt="Zetoe logo"
        width={90}
        height={90}
        className="rounded-full sm:w-[200px] sm:h-[200px]"
      />
    </div>
  );
}
