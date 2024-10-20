import React from "react";
import { Resend } from "resend";

export const sendEmail = async (
  to: string,
  subject: string,
  template: React.ReactNode,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>", // свой домен указывать надо
    to,
    subject, // заголовк
    react: template,
  });

  if (error) {
    throw error;
  }

  return data;
};