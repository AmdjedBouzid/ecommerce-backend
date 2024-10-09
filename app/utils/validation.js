import { z } from "zod";

export const regester = z.object({
  username: z.string().min(3, { message: "your name is invalid" }).max(100),
  email: z
    .string()
    .min(6, { message: "your email is invalid" })
    .max(100)
    .email(),
  password: z
    .string()
    .min(6, { message: "your password is invalid" })
    .regex(/[a-zA-Z]/, { message: "must contain letters" })
    .regex(/[0-9]/, { message: "must contain numbers" }),
  phonenumber: z
    .string()
    .regex(/^\d{10}$/, { message: "your phone number must be 10 digits" }),
});
// export const Login = z.object({
//   email: z
//     .string()
//     .min(10, { message: "your data is invalid" })
//     .max(100)
//     .email(),
//   password: z
//     .string()
//     .min(6, { message: "your password is invalid" })
//     .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
//       message: "password must contain at least one letter and one number",
//     }),
// });
