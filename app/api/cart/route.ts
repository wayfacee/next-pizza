import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/shared/lib";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { type CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value; // 11:17

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          // проверка, тут был userId но он уже не нужен тут
          {
            token,
          },
        ],
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc", // новый - старый
          },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(userCart);
  } catch (e) {
    console.log(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("cartToken")?.value;

    if (!token) {
      // crypto - спец. нод библа
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;

    // добавлял ли пиццу с такими же опциями, куантити + 1
    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        ingredients: {
          // призма не умеет делать вот такую проверку
          // поэтому забили (15:19)
          every: {
            // кд связать его с эти картАйтемом
            id: { in: data.ingredients },
            // если передать в инг - товары, то найдет
            // а если там пусто, и сказать дай мне товар у которого нет инг
            // он скажет, что такого товара - нет, даже если в корзине есть товар
            // без инг., можно написать запрос через SQL, или через костыль - жс (15:21)
          },
        },
      },
    });

    // Если товар был найден, делаем + 1
    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
      });
    } else {
      // НУЖНО ОБЯЗ. ЧЕРЕЗ ЕЛСЕ
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: data.productItemId,
          quantity: 1,
          ingredients: { connect: data.ingredients?.map((id) => ({ id })) },
        },
      });
    }

    const updatedUserCart = await updateCartTotalAmount(token);

    const resp = NextResponse.json(updatedUserCart);
    // вшиваем в кукисы токен, можно еще добавить maxAge
    resp.cookies.set("cartToken", token);
    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json(
      { message: "Не удалось создать корзину" },
      { status: 500 },
    );
  }
}
