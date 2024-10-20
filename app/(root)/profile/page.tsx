import { prisma } from "@/prisma/prisma-client";
import { ProfileForm } from "@/shared/components";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // через юзсешен не над редиректить, тк это юзЕфф., и тип не по быстрому
  // и происзодит на ур. браузера
  const session = await getUserSession(); // проверка на ур. сервера

  if (!session) {
    return redirect("/not-auth");
  }

  const user = await prisma.user.findFirst({
    where: { id: Number(session?.id) },
  });

  if (!user) {
    return redirect("/not-auth");
  }

  return <ProfileForm data={user} />;
}
