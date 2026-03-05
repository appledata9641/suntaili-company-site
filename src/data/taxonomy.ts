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
    categoryIds: ["accessory", "access-control"],
  },
];

export const taxonomySubcategories: ProductSubcategory[] = [
  { key: "ip-camera-2mp", name: "網路攝影機 2MP", categoryId: "camera" },
  { key: "ip-camera-5mp", name: "網路攝影機 5MP", categoryId: "camera" },
  { key: "nvr", name: "NVR 錄影主機", categoryId: "recorder" },
  { key: "dvr", name: "DVR 錄影主機", categoryId: "recorder" },
  { key: "poe-switch", name: "PoE 交換器", categoryId: "accessory" },
  { key: "wireless-bridge", name: "無線橋接器", categoryId: "accessory" },
  { key: "video-extender", name: "影音延伸設備", categoryId: "accessory" },
  { key: "door-controller", name: "門禁控制器", categoryId: "access-control" },
  { key: "other-camera", name: "其他攝影機", categoryId: "camera" },
  { key: "other-recorder", name: "其他錄影主機", categoryId: "recorder" },
  { key: "other-accessory", name: "其他周邊", categoryId: "accessory" },
  { key: "other-access-control", name: "其他門禁設備", categoryId: "access-control" },
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
            label: "自有品牌",
            children: [
              { key: "ahd-self-2m", label: "2MP" },
              { key: "ahd-self-5m", label: "5MP" },
            ],
          },
          {
            key: "ahd-brand-avtech",
            label: "AVTECH",
            children: [
              { key: "ahd-avtech-2m", label: "2MP" },
              { key: "ahd-avtech-5m", label: "5MP" },
            ],
          },
          {
            key: "ahd-brand-dahua",
            label: "DAHUA",
            children: [
              { key: "ahd-dahua-2m", label: "2MP" },
              { key: "ahd-dahua-5m", label: "5MP" },
            ],
          },
        ],
      },
      {
        key: "ahd-dvr",
        label: "DVR 錄影機",
        children: [{ key: "ahd-dvr-4ch", label: "4CH / 8CH / 16CH" }],
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
            label: "自有品牌",
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
              { key: "ip-self-8m", label: "8MP" },
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
            label: "自有品牌",
            productSlugs: ["suntaili-nvr-8ch-4k"],
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
      {
        key: "ip-access-control",
        label: "門禁系統",
        children: [
          {
            key: "door-controller",
            label: "門禁控制器",
            productSlugs: ["suntaili-ac-2door-controller"],
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
