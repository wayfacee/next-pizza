import { useRouter } from "next/navigation";
import { Filters } from "./use-filters";
import React from "react";
import qs from "qs";

export const useQueryFilters = (filters: Filters) => {
  const isMounted = React.useRef(false); // перезатираются парамсы.
  const router = useRouter();

  // в useFilters - объект который возв. кд раз перерисовывается
  // и опять вызывается хук useFilters
  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        ...filters.prices,
        pizzaTypes: Array.from(filters.pizzaTypes),
        sizes: Array.from(filters.sizes),
        ingredients: Array.from(filters.selectedIngredients),
      };

      // qs - в запросную строку
      const query = qs.stringify(params, {
        arrayFormat: "comma", // если не передадим comma, то будут некоторые повторяться
      });

      router.push(`?${query}`, {
        scroll: false,
      });
    }
    
    isMounted.current = true;
  }, [filters]); // router НЕЛЬЗЯ СЮДА, будут баги 14:13
};
