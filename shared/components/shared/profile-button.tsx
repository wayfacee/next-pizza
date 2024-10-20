import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "../ui";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  onClickSignIn,
  className,
}) => {
  // почему при клике с задержкой, пошта запрос на сервер и возв. инфу
  // и этот запрос надо ожидать, он выполняется юзеффектом, под капотом
  // юзСешена, и это надо ожидать, можно склетон показывать пока
  const { data: session } = useSession();
  // если не хотим useEff. + context., а хотим в сервере сделать проверку
  // то getServerSession, проверить роль, актив не актив итд.

  return (
    <div className={className}>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          variant={"outline"}
          className="flex items-center gap-1"
        >
          <User size={16} />
          Войти
        </Button>
      ) : (
        <Link href="/profile">
          <Button variant="secondary" className="flex items-center gap-2">
            <CircleUser size={18} />
            Профиль
          </Button>
        </Link>
      )}
    </div>
  );
};

/**
 * onClick={() => signIn("github", {
              callbackUrl: '/', // !!!!!!!!!!!!!
              redirect: true
            })}
 */
