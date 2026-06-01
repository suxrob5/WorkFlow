export type AppLanguage = "ru" | "uz";

export type PositionKey =
  | "warehouse_manager"
  | "warehouse_assistant_manager"
  | "warehouse_supervisor"
  | "shipping_controller"
  | "receiving_controller"
  | "picker"
  | "loader";

export type PositionOption = {
  key: PositionKey;
  uz: string;
  ru: string;
};

export const POSITIONS: PositionOption[] = [
  {
    key: "warehouse_manager",
    uz: "Ombor raxbari",
    ru: "Руководитель склада",
  },
  {
    key: "warehouse_assistant_manager",
    uz: "Ombor raxbari yordamchisi",
    ru: "Заместитель руководителя склада",
  },
  {
    key: "warehouse_supervisor",
    uz: "Ombor mudiri",
    ru: "Супервайзер",
  },
  {
    key: "shipping_controller",
    uz: "Buyurtmalarni jo'natish nazoratchisi",
    ru: "Контролёр отправки товаров",
  },
  {
    key: "receiving_controller",
    uz: "Buyurtmalarni qabul qilish nazoratchisi",
    ru: "Контролёр приёмки товаров",
  },
  {
    key: "picker",
    uz: "Tovar yig'uvchi",
    ru: "Комплектовщик",
  },
  {
    key: "loader",
    uz: "Yuk tashuvchi",
    ru: "Грузчик",
  },
];

export const getCurrentLanguage = (): AppLanguage => {
  if (typeof window === "undefined") return "ru";

  const savedLanguage =
    window.localStorage.getItem("language") ||
    window.localStorage.getItem("locale") ||
    window.localStorage.getItem("lang") ||
    document.documentElement.lang ||
    navigator.language;

  return savedLanguage.toLowerCase().startsWith("uz") ? "uz" : "ru";
};

export const findPosition = ({
  positionKey,
  position,
  positionRu,
}: {
  positionKey?: string;
  position?: string;
  positionRu?: string;
}) =>
  POSITIONS.find((item) => item.key === positionKey) ??
  POSITIONS.find((item) => item.uz === position || item.ru === positionRu) ??
  POSITIONS.find((item) => item.uz === position || item.ru === position);

export const getPositionLabel = (
  data: {
    positionKey?: string;
    position?: string;
    positionRu?: string;
  },
  language: AppLanguage = getCurrentLanguage(),
) => {
  const position = findPosition(data);

  if (position) {
    return language === "uz" ? position.uz : position.ru;
  }

  return language === "uz"
    ? data.position || data.positionRu || "Xodim"
    : data.positionRu || data.position || "Сотрудник";
};
