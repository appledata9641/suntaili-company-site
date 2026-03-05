import { productCategories } from "@/data/categories";
import type { Product, ProductCategory } from "@/types/product";
import type {
  ProductCategoryGroup,
  ProductSubcategory,
  TaxonomyCategoryNode,
  TaxonomyGroupNode,
  TaxonomyMenuGroup,
} from "@/types/taxonomy";

export const taxonomyGroups: ProductCategoryGroup[] = [
  {
    key: "ip-surveillance",
    name: "數位網路監控商品",
    categoryIds: ["camera", "recorder"],
  },
  {
    key: "infrastructure",
    name: "周邊與管理設備",
    categoryIds: ["accessory"],
  },
];

export const taxonomySubcategories: ProductSubcategory[] = [
  { key: "ahd-camera-2mp", name: "AHD 攝影機 2MP", categoryId: "camera" },
  { key: "ahd-camera-5mp", name: "AHD 攝影機 5MP", categoryId: "camera" },
  { key: "ip-camera-2mp", name: "網路攝影機 2MP", categoryId: "camera" },
  { key: "ip-camera-5mp", name: "網路攝影機 5MP", categoryId: "camera" },
  { key: "ip-camera-8mp", name: "網路攝影機 8MP", categoryId: "camera" },
  { key: "nvr", name: "NVR 錄影主機", categoryId: "recorder" },
  { key: "dvr", name: "DVR 錄影主機", categoryId: "recorder" },
  { key: "poe-switch", name: "PoE 交換器", categoryId: "accessory" },
  { key: "wireless-bridge", name: "無線橋接器", categoryId: "accessory" },
  { key: "video-extender", name: "影音延伸設備", categoryId: "accessory" },
  { key: "other-camera", name: "其他攝影機", categoryId: "camera" },
  { key: "other-recorder", name: "其他錄影主機", categoryId: "recorder" },
  { key: "other-accessory", name: "其他周邊", categoryId: "accessory" },
];

export const menuTaxonomyGroups: TaxonomyMenuGroup[] = [
  {
    key: "analog-hd",
    name: "模擬類比高清商品",
    columns: [
      {
        key: "ahd-camera",
        label: "AHD 攝影機",
        children: [
          {
            key: "ahd-brand-self",
            label: "三泰利",
            searchKeyword: "三泰利 AHD",
            children: [
              {
                key: "ahd-self-2m",
                label: "2MP",
                productSlugs: [
                  "suntaili-ahd-2mp-bullet",
                  "suntaili-ahd-2mp-ac-229d",
                  "suntaili-ahd-2mp-ac-230",
                  "suntaili-ahd-2mp-ac-238s",
                  "suntaili-ahd-2mp-ac-260v",
                ],
              },
              {
                key: "ahd-self-5m",
                label: "5MP",
                productSlugs: ["suntaili-ahd-5mp-bullet"],
              },
            ],
          },
          {
            key: "ahd-brand-avtech",
            label: "AVTECH",
            searchKeyword: "AVTECH AHD",
            children: [
              {
                key: "ahd-avtech-2m",
                label: "2MP",
                productSlugs: ["avtech-ahd-2mp-dome"],
              },
              {
                key: "ahd-avtech-5m",
                label: "5MP",
                productSlugs: ["avtech-ahd-5mp-dome"],
              },
            ],
          },
          {
            key: "ahd-brand-dahua",
            label: "DAHUA",
            searchKeyword: "DAHUA AHD",
            children: [
              {
                key: "ahd-dahua-2m",
                label: "2MP",
                productSlugs: ["dahua-ahd-2mp-bullet"],
              },
              {
                key: "ahd-dahua-5m",
                label: "5MP",
                productSlugs: ["dahua-ahd-5mp-bullet"],
              },
            ],
          },
        ],
      },
      {
        key: "ahd-dvr",
        label: "DVR 錄影機",
        children: [
          {
            key: "ahd-dvr-self",
            label: "三泰利",
            searchKeyword: "三泰利 DVR",
            children: [
              {
                key: "ahd-dvr-self-4ch",
                label: "4路",
                searchKeyword: "三泰利 DVR 4路",
                productSlugs: ["suntaili-dvr-4ch-hybrid", "suntaili-dvr-rd-1304ah"],
              },
              {
                key: "ahd-dvr-self-8ch",
                label: "8路",
                searchKeyword: "三泰利 DVR 8路",
                productSlugs: ["suntaili-dvr-8ch-hybrid", "suntaili-dvr-rd-1308ah"],
              },
              {
                key: "ahd-dvr-self-16ch",
                label: "16路",
                searchKeyword: "三泰利 DVR 16路",
                productSlugs: ["suntaili-dvr-16ch-hybrid", "suntaili-dvr-rd-2316ah"],
              },
            ],
          },
          {
            key: "ahd-dvr-avtech",
            label: "AVTECH",
            searchKeyword: "AVTECH DVR",
            children: [
              {
                key: "ahd-dvr-avtech-4ch",
                label: "4路",
                searchKeyword: "AVTECH DVR 4路",
                productSlugs: ["avtech-dvr-4ch-hybrid"],
              },
              {
                key: "ahd-dvr-avtech-8ch",
                label: "8路",
                searchKeyword: "AVTECH DVR 8路",
                productSlugs: ["avtech-dvr-8ch-hybrid"],
              },
              {
                key: "ahd-dvr-avtech-16ch",
                label: "16路",
                searchKeyword: "AVTECH DVR 16路",
                productSlugs: ["avtech-dvr-16ch-hybrid"],
              },
            ],
          },
          {
            key: "ahd-dvr-dahua",
            label: "DAHUA",
            searchKeyword: "DAHUA DVR",
            children: [
              {
                key: "ahd-dvr-dahua-4ch",
                label: "4路",
                searchKeyword: "DAHUA DVR 4路",
                productSlugs: ["dahua-dvr-4ch-hybrid"],
              },
              {
                key: "ahd-dvr-dahua-8ch",
                label: "8路",
                searchKeyword: "DAHUA DVR 8路",
                productSlugs: ["dahua-dvr-8ch-hybrid"],
              },
              {
                key: "ahd-dvr-dahua-16ch",
                label: "16路",
                searchKeyword: "DAHUA DVR 16路",
                productSlugs: ["dahua-dvr-16ch-hybrid"],
              },
            ],
          },
        ],
      },
      { key: "ahd-special", label: "特殊機種攝影機" },
    ],
  },
  {
    key: "ip-digital",
    name: "數位網路高清商品",
    columns: [
      {
        key: "ip-camera",
        label: "網路攝影機",
        children: [
          {
            key: "ip-self",
            label: "三泰利",
            searchKeyword: "三泰利 IPC",
            children: [
              {
                key: "ip-self-2m",
                label: "2MP",
                productSlugs: ["suntaili-2mp-dome-ip-camera"],
              },
              {
                key: "ip-self-5m",
                label: "5MP",
                productSlugs: ["suntaili-5mp-outdoor-bullet-ai"],
              },
              {
                key: "ip-self-8m",
                label: "8MP",
                productSlugs: ["suntaili-8mp-4k-ip-bullet"],
              },
            ],
          },
          {
            key: "ip-avtech",
            label: "AVTECH",
            searchKeyword: "AVTECH IPC",
            children: [
              {
                key: "ip-avtech-2m",
                label: "2MP",
                productSlugs: ["avtech-ipc-2mp-mini-dome"],
              },
              {
                key: "ip-avtech-5m",
                label: "5MP",
                productSlugs: ["avtech-ipc-5mp-ai-bullet"],
              },
              {
                key: "ip-avtech-8m",
                label: "8MP",
                productSlugs: ["avtech-ipc-8mp-4k-bullet"],
              },
            ],
          },
          {
            key: "ip-dahua",
            label: "DAHUA",
            searchKeyword: "DAHUA IPC",
            children: [
              {
                key: "ip-dahua-2m",
                label: "2MP",
                productSlugs: ["dahua-ipc-2mp-lite-dome"],
              },
              {
                key: "ip-dahua-5m",
                label: "5MP",
                productSlugs: ["dahua-ipc-5mp-pro-bullet"],
              },
              {
                key: "ip-dahua-8m",
                label: "8MP",
                productSlugs: ["dahua-ipc-8mp-4k-ai"],
              },
            ],
          },
          { key: "ip-ptz", label: "PTZ 快速球型攝影機" },
          { key: "ip-special", label: "特殊機種攝影機" },
        ],
      },
      {
        key: "ip-nvr",
        label: "NVR 錄影機",
        children: [
          {
            key: "ip-nvr-self",
            label: "三泰利",
            searchKeyword: "三泰利 NVR",
            productSlugs: ["suntaili-nvr-8ch-4k"],
          },
          {
            key: "ip-nvr-avtech",
            label: "AVTECH",
            searchKeyword: "AVTECH NVR",
            productSlugs: ["avtech-nvr-16ch-4k"],
          },
          {
            key: "ip-nvr-dahua",
            label: "DAHUA",
            searchKeyword: "DAHUA NVR",
            productSlugs: ["dahua-nvr-16ch-4k"],
          },
        ],
      },
      {
        key: "platform-zone",
        label: "平台設備專區",
        children: [{ key: "vms-platform", label: "VMS 管理平台" }],
      },
      {
        key: "ip-accessory",
        label: "周邊配件",
        children: [
          {
            key: "ip-poe-switch",
            label: "PoE 交換器",
            productSlugs: ["suntaili-poe-switch-8p"],
          },
          {
            key: "ip-wireless-bridge",
            label: "無線橋接器",
            productSlugs: ["suntaili-wireless-bridge-2km"],
          },
          {
            key: "ip-video-extender",
            label: "影音延伸設備",
            productSlugs: ["suntaili-hdmi-extender-30m"],
          },
        ],
      },
    ],
  },
];

function getFallbackSubcategoryKey(category: ProductCategory): string {
  return `other-${category}`;
}

function resolveSubcategoryKey(product: Product): string {
  return product.subcategoryKey || getFallbackSubcategoryKey(product.category);
}

export function getProductsBySubcategory(products: Product[]): Record<string, Product[]> {
  const grouped: Record<string, Product[]> = {};

  for (const product of products) {
    const key = resolveSubcategoryKey(product);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(product);
  }

  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.model.localeCompare(b.model, "zh-Hant"));
  }

  return grouped;
}

export function getTaxonomyTree(products: Product[]): TaxonomyGroupNode[] {
  const groupedProducts = getProductsBySubcategory(products);
  const subcategoryByKey = new Map(taxonomySubcategories.map((item) => [item.key, item]));

  const categoriesById = new Map(productCategories.map((category) => [category.id, category]));

  const categoryNodesById = new Map<ProductCategory, TaxonomyCategoryNode>();

  for (const category of productCategories) {
    const subcategories = taxonomySubcategories
      .filter((subcategory) => subcategory.categoryId === category.id)
      .map((subcategory) => ({
        subcategory,
        products: groupedProducts[subcategory.key] ?? [],
      }))
      .filter((node) => node.products.length > 0);

    const unmatchedProducts = products
      .filter((product) => product.category === category.id)
      .filter((product) => !subcategoryByKey.has(resolveSubcategoryKey(product)));

    if (unmatchedProducts.length > 0) {
      subcategories.push({
        subcategory: {
          key: getFallbackSubcategoryKey(category.id),
          name: "其他",
          categoryId: category.id,
        },
        products: unmatchedProducts.sort((a, b) => a.model.localeCompare(b.model, "zh-Hant")),
      });
    }

    categoryNodesById.set(category.id, {
      category,
      subcategories,
    });
  }

  return taxonomyGroups
    .map((group) => ({
      group,
      categories: group.categoryIds
        .map((id) => categoriesById.get(id))
        .filter((category): category is NonNullable<typeof category> => Boolean(category))
        .map((category) => categoryNodesById.get(category.id))
        .filter((node): node is NonNullable<typeof node> => Boolean(node))
        .filter((node) => node.subcategories.length > 0),
    }))
    .filter((groupNode) => groupNode.categories.length > 0);
}
