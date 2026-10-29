import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";

// 支架配件（攝影機才顯示）。相容性需依型號確認，因此只做安裝方式的一般說明。
const brackets = [
  {
    title: "壁掛式",
    description: "固定於牆面或柱面，適合室內外牆面安裝。",
    image: "/images/site/product/bracket-wall.webp",
    alt: "壁掛式支架",
    width: 105,
    height: 150,
  },
  {
    title: "天花板",
    description: "吸頂安裝於天花板，適合室內半球型攝影機。",
    image: "/images/site/product/bracket-ceiling.webp",
    alt: "天花板吸頂座",
    width: 123,
    height: 118,
  },
  {
    title: "支架",
    description: "延伸安裝距離或調整角度，適合轉角與外牆。",
    image: "/images/site/product/bracket-arm.webp",
    alt: "延伸支架",
    width: 107,
    height: 145,
  },
];

export default function BracketSection() {
  return (
    <section id="accessories" aria-labelledby="accessories-title" className="scroll-mt-[114px]! px-4 pt-14 lg:scroll-mt-[134px]! lg:pt-[55px]">
      <SectionTitle title={<span id="accessories-title">支架配件</span>} />
      <ul className="mx-auto mt-6 grid max-w-[896px] gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-4 lg:gap-[31px]">
        {brackets.map((bracket) => (
          <li
            key={bracket.title}
            className="flex items-center gap-4 border border-brand-line bg-white p-4 sm:h-[277px] sm:flex-col sm:items-stretch sm:gap-0 sm:px-6 sm:pb-4 sm:pt-[26px] lg:px-10"
          >
            <div className="flex h-[110px] w-[90px] shrink-0 items-center justify-center sm:order-last sm:h-auto sm:w-auto sm:flex-1 sm:pt-5">
              <Image
                src={bracket.image}
                alt={bracket.alt}
                width={bracket.width}
                height={bracket.height}
                className="max-h-full w-auto object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold leading-6 text-brand-navy sm:text-center">{bracket.title}</h3>
              <p className="mt-1 text-xs font-bold leading-[18px] text-brand-muted sm:mt-[6px] sm:leading-[14px]">{bracket.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-4 max-w-[896px] text-center text-xs leading-5 text-brand-grey">
        支架與配件需依攝影機型號確認相容，請於詢價時告知安裝位置。
      </p>
    </section>
  );
}
