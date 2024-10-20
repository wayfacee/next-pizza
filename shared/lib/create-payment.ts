import axios from "axios";
import { type PaymentData } from "@/@types/yookassa";

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

export async function createPayment(details: Props) {
  const { data } = await axios.post<PaymentData>(
    "https://api.yookassa.ru/v3/payments",
    {
      amount: {
        // сумма платежа
        value: details.amount,
        currency: "RUB",
      },
      capture: true,
      description: details.description, // что мы планируем продовать челу
      metadata: {
        // DF;YJ
        // что за инфа должна быть исп. в момент создания платежа, и в момент
        // когда платеж успешно оплачен / отменен, это доп. инфа будет идти до самого завершения оплаты

        // какой заказ хотим указать, чтоб он был оплачен / отменен
        // можно любую инфу указать, и эта инфа. будет возв. после оплаты
        order_id: details.orderId,
      },
      confirmation: {
        // куда редирект, после успешной оплаты
        type: "redirect",
        // return_url: process.env.YOOKASSA_CALLBACK_URL,
        return_url: "http://localhost:3000/?paid",
      },
    },
    {
      // опции для запроса
      // авториз. инфа + хедер
      auth: {
        username: process.env.YOOKASSA_STORE_ID as string,
        password: process.env.YOOKASSA_API_KEY as string, // передеам ключ в виде password,
      },
      headers: {
        "Content-Type": "application/json",
        // Idempotency-Key - вшиваем рандом. знач., спец. идент., который
        // позволит юкассе, что платеж отличаются друг от друга, уникализировать типо
        "Idempotency-Key": Math.random().toString(36).substring(7),
      },
    },
  );

  return data;
}
