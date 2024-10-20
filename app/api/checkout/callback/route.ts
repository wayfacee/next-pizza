// ордер всегда остается пендинг, и юкасса не может оповестить об жтом
// можно через http

import { PaymentCallbackData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import { OrderSuccessTemplate } from "@/shared/components";
import { sendEmail } from "@/shared/lib";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // вытаскиваем PaymentCallbackData
    const body = (await req.json()) as PaymentCallbackData;

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
      // include: {
      //   user: true, // должны отправить письмо юзеру
      // но уже в оредере есть емаил, так чо уже не надо
      // },
    });

    // в логах юкасса все равно сказал бы какой ответ ретурнс
    if (!order) {
      return NextResponse.json({ error: "Order not found" });
    }

    // youkassa возв. такой статус
    const isSucceded = body.object.status === "succeeded";

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceded ? OrderStatus.SUCCEEDED : OrderStatus.CANCALLED,
      },
    });

    const items = JSON.parse(order?.items as string) as CartItemDTO[];

    if (!isSucceded) {
      await sendEmail(
        order.email,
        "Next Pizza / Ваш заказ оформлен 🚀",
        OrderSuccessTemplate({ orderId: order.id, items }),
      );
    } else {
      // если оплачен, то надо отправить письмо юзеру
    }
  } catch {
    return NextResponse.json({ error: "Server error" });
  }
}
