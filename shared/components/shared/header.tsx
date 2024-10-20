"use client";

import React from "react";
import { Container } from "./container";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { AuthModal } from "./modals";
import { ProfileButton } from "./profile-button";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const router = useRouter();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const searchParams = useSearchParams();

  // написали сюда, пошта комп. почти всегда рендер.
  React.useEffect(() => {
    let toastMessage = "";

    if (searchParams.has("paid")) {
      toastMessage = "Заказ успешно оплачен! Информация отправлена на почту";
    }

    if (searchParams.has("verified")) {
      toastMessage = "Почта успешно подтверждена!";
    }

    if (toastMessage) {
      setTimeout(() => {
        // тоастеру нужно время
        router.replace("/");
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 500);
    }
  }, []);

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/** left side */}
        <Link href={"/"}>
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />

            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <div className="text-sm text-gray-400 leading-3">
                вкусней уже некуда
              </div>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/** right side */}
        <div className="flex items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {/** тока когда навели на этот group hover, будет отрабатывать ховер 49:10 */}
          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
