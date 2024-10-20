import { prisma } from "@/prisma/prisma-client";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
  priceFrom?: string;
  priceTo?: string;
  // no pagination
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => {
  const sizes = params.sizes?.split(",").map(Number);
  const pizzaTypes = params.pizzaTypes?.split(",").map(Number);
  const ingredientsIdArr = params.ingredients?.split(",").map(Number);

  const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

  const categories = await prisma.category.findMany({
    include: {
      // когда буш доставать категории
      // прикрути ему продукты (есть связь - есть include)
      products: {
        orderBy: {
          id: "desc",
        },
        where: {
          ingredients: ingredientsIdArr
            ? {
                some: {
                  id: {
                    in: ingredientsIdArr,
                  },
                },
              }
            : undefined,
          items: {
            some: {
              size: {
                in: sizes,
              },
              pizzaType: {
                in: pizzaTypes,
              },
              price: {
                gte: minPrice, // greater than equal >=
                lte: maxPrice, // less than equal <=
              },
            },
          },
        },
        include: {
          ingredients: true,
          items: {
            // склеился с продуктами, и айтемсы начал сорт. по прайсу
            where: {
              // когда веренешь связь + отсорт.,  паралел. проверь
              // в этом списке айтемсов, прайс пицц нач. от gte до lte
              // корректно - сорт. + поиск
              price: {
                // если этого не сделать, выше стоящий gte + lte - пытаются найти
                // которые соот. тому условию, а если не соотв., то он не вернет весь продукт
                // поиск чисто по продукту, а тут чисто по айтемсам
                gte: minPrice,
                lte: maxPrice,
              },
            },
            orderBy: {
              price: "asc", // от самой дешев. - самой дорогой
            },
          },
        },
      },
    },
  });

  return categories;
};
