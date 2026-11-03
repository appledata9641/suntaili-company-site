import Image from "next/image";
import { coreServices } from "@/data/about";

// 關於我們「核心與服務」：四格相連（289×320），桌機一排四格、平板 2×2、手機一欄。
// 四張圖用美編 11/03 更新的素材（已調好色調與下方暗部），直接顯示、不再疊色。
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
