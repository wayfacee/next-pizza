'use client'; // useContext 

import React from "react";
import { WhiteBlock } from "../white-block";
import { FormTextarea } from "../form";
import { AdressInput } from "../address-input";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorText } from "../error-text";

interface Props {
  className?: string;
}

export const CheckoutAdressForm: React.FC<Props> = ({ className }) => {
  const { control } = useFormContext();
  return (
    <WhiteBlock title="3. Адрес доставки" className={className}>
      <div className="flex flex-col gap-5">
        {/* placeholder="Введите адрес..." */}
        {/* ситуация нельзя взять и прокинуть регистр в него, 
        но нужно валидировать на ур. рхф
        */}
        <Controller
          name="address"
          render={
            // будем вызывать onChange этого аддресса
            ({ field, fieldState }) => (
              <>
                <AdressInput onChange={field.onChange} />
                {fieldState.error?.message && (
                  <ErrorText text={fieldState.error.message} />
                )}
              </>
            )
            // будет кд раз перерис., если будет чето меняться в нашей форме
          }
          control={control}
        />

        <FormTextarea
          name="comment"
          className="text-base"
          placeholder="Комментарий к заказу"
          rows={5}
        />
      </div>
    </WhiteBlock>
  );
};
