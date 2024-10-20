import { z } from "zod";

// можно было бы сделать отдельные схемы, и смержить их в 1 схему
// до этого было в schemas / 

export const checkoutFormSchema = z.object({
  // min из 2 символов
  firstName: z.string().min(2, { message: 'Имя должно содержать не менее 2-х символов' }),
  lastName: z.string().min(2, { message: 'Фамилия должна содержать не менее 2-х символов' }),
  email: z.string().email({ message: 'Введите корректную почту' }),
  phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
  address: z.string().min(5, { message: 'Введите корректный адрес' }),
  comment: z.string().optional(),
});

// zod должен взять тип нашей схемы с помощью тайпофа, и его заюзать
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
