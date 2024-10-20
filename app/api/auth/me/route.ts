import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextResponse } from "next/server";

// некст не особо хочет работать с
// const user = await getUserSession();
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getUserSession();
    // const user = await getServerSession(req, res, authOptions);

    if (!user) {
      return NextResponse.json(
        { message: "Вы не авторизованы" },
        { status: 401 },
      );
    }

    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
      select: {
        fullName: true,
        email: true,
        password: false,
      },
    });

    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "[USER_GET] Server Error" },
      { status: 500 },
    );
  }
}
