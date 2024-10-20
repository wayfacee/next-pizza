import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcryptjs";
import { UserRole } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER" as UserRole,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // для некстауф + для рендера жсх формы
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        // compare - bcrypt
        // на ур. ноджс. берет наш пароль, типо:
        // 123456 - bcrypt будет конверт в спец.хэш
        // и сверять с тем хэшом, который в бд -> kfwerlwefvwklsslwertyhjmnbc
        // kfwerlwefvwklsslwertyhjmnbc - пароль в бд (как хэш хранится)
        const isPasswordValid = await compare(
          credentials.password,
          findUser.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        if (!findUser.verified) {
          return null;
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  // позволяет корректно ген. jwt token (можно любое знач.)
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") {
          return true; // if it's email & pass.
        }

        // если авториз. через провайдер, то вот эти дейвст. не над
        // дальше выполнять, но если через провайдеры, то надо
        if (!user.email) {
          return false;
        }

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              // checking by provider or by email
              // signIn будет отраб., когда кликаешь провайдеры
              {
                provider: account?.provider,
                providerId: account?.providerAccountId,
                // юзер измен. почту в гх, поэтому храним его ид, и проверяем по нему
              },
              {
                email: user.email, // есть ли у провайдера - емайл
              },
            ],
          },
        });

        if (findUser) {
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          });

          return true;
        }
        // else:

        await prisma.user.create({
          data: {
            email: user.email,
            // вшили нейм соц.сети
            fullName: user.name || "User #" + user.id,
            // ПЕРЕДАВАТЬ АЙДИ НЕ БЕЗОПАСНО!!!!!!
            password: hashSync(user.id.toString(), 10),
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
          },
        });

        return true;
      } catch (e) {
        console.log("Error [SIGNIN]", e);
        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        // token вернет просто id + email 20:50
        // а мы всю ост. часть докруичиваем
        token.id = String(findUser.id);
        token.email = findUser.email;
        token.fullName = findUser.fullName;
        token.role = findUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
