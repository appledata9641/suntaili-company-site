import Image from "next/image";
import { coreServices } from "@/data/about";

// 設計稿第 3、4 格是深藍漸層（看不到照片），這兩張素材圖本身是照片，因此疊一層同色漸層
const navyOverlay =
  "bg-[linear-gradient(180deg,rgba(31,54,86,0.92)_0%,rgba(65,81,106,0.9)_25%,rgba(63,77,96,0.9)_40%,rgba(46,55,70,0.92)_60%,rgba(21,29,40,0.95)_80%,rgba(9,16,26,0.97)_100%)]";

// 關於我們「核心與服務」：四格相連（289×320），桌機一排四格、平板 2×2、手機一欄
export default function CoreServiceTiles() {
  return (
    <ul className="mx-auto grid max-w-[1156px] sm:grid-cols-2 lg:grid-cols-4">
      {coreServices.map((service, index) => (
        <li
          key={service.title}
          className={`relative isolate h-[300px] overflow-hidden bg-brand-navy sm:h-[320px] ${index === 3 ? "lg:border-l lg:border-white/10" : ""}`}
        >
          <Image
            src={service.image}
            alt=""
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 289px, (min-width: 640px) 50vw, 100vw"
            className="-z-10 object-cover"
          />
          {index >= 2 ? <span aria-hidden className={`absolute inset-0 -z-10 ${navyOverlay}`} /> : null}
          <h3 className="absolute inset-x-0 top-[115px] text-center text-[22px] font-medium leading-8 tracking-[0.08em] text-white sm:top-[123px] lg:text-2xl">
            {service.title}
          </h3>
          <p className="absolute bottom-[30px] left-[42px] whitespace-nowrap text-base font-bold leading-[23px] tracking-[0.1em] text-white xl:text-lg">
            {service.descriptionLines[0]}
            <br />
            {service.descriptionLines[1]}
          </p>
        </li>
      ))}
    </ul>
  );
}
