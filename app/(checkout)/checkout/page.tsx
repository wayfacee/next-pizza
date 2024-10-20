"use client";

import {
  CheckoutAdressForm,
  CheckoutCart,
  CheckoutPersonalForm,
  CheckoutSidebar,
  Container,
  Title,
} from "@/shared/components";
import { useCart } from "@/shared/hooks";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/contstants";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import React from "react";
import { useSession } from "next-auth/react";
import { Api } from "@/shared/services/api-client";

export default function CheckoutPage() {
  const { data: session } = useSession();

  const [submiting, setSubmitning] = React.useState(false);
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } =
    useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(' ');

      form.setValue('firstName', firstName);
      form.setValue('lastName', lastName);
      form.setValue('email', data.email);
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session, form]);

  // можно и без сабмитэнд
  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    try {
      setSubmitning(true);
      // эта функц. будет ген. эту ссылку, и потом редирект
      const url = await createOrder(data); // будет передаваться массив, типо в сервер будет приходить [{}]
      toast.success("Заказ успешно оформлен! 📝 Переход на оплату...", {
        icon: "✅",
      });
      console.log(url);

      if (url) {
        location.href = url;
      }
    } catch (e) {
      console.log(e);
      setSubmitning(false); // без finaly
      toast.error("Не удалось оформить заказ", {
        icon: "❌",
      });
    }
  };

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus",
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        className="font-extrabold mb-8 text-[36px]"
      />

      <FormProvider {...form}>
        {/** handleSubmit - вызывает валидацию,
         * если все ок, то будет вызывать onSubmit
         */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/** Left side */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                items={items}
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                loading={loading}
              />

              <CheckoutPersonalForm
                // cn({"opacity-40 pointer-events-none" : loading})
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />

              <CheckoutAdressForm
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />
            </div>

            {/** Right side */}
            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submiting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
