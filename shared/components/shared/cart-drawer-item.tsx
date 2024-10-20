import React from "react";
import * as CartItem from "./cart-item-details";
import type { CartItemProps } from "./cart-item-details";
import { cn } from "@/shared/lib";
import { CountButton } from "./count-button";
import { Trash2Icon } from "lucide-react";

interface Props extends CartItemProps {
  className?: string;
  onClickCountButton?: (type: "plus" | "minus") => void;
  onClickRemove?: () => void;
}

export const CartDrawerItem: React.FC<Props> = ({
  id,
  imageUrl,
  name,
  onClickRemove,
  price,
  details,
  onClickCountButton,
  disabled,
  // ingredients,
  // pizzaSize,
  // type,
  quantity,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex bg-white p-5 gap-6",
        {
          // с посомощью цсс можно откл. интерактивность
          "opacity-50 pointer-events-none": disabled,
        },
        className,
      )}
    >
      <CartItem.Image src={imageUrl} />

      {/** на всб оставшиюся ширину экрана */}
      <div className="flex-1">
        <CartItem.Info name={name} details={details} />

        <hr className="my-3" />

        <div className="flex justify-between items-center">
          <CountButton onClick={onClickCountButton} value={quantity} />

          <div className="flex items-center gap-3">
            <CartItem.Price value={price} />
            <Trash2Icon
              onClick={onClickRemove}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
