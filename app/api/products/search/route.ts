import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "";

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query, // includes js
        mode: "insensitive", // Без чувствительности
      },
    },
    take: 5, // возвращать тока 5 продуктов
  });

  return NextResponse.json(products);
}