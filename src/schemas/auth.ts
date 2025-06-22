import { object, TypeOf, z } from "zod";

enum Role {
  ADMIN,
  USER,
}

export const createUserSchema = z.object({
  body: object({
    name: z.string({ required_error: "Name is required" }),
    username: z.string({ required_error: "username is required" }),
    email: z
      .string({ required_error: "Email address is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: z.string({
      required_error: "Please confirm your password",
    }),
    role: z.optional(z.nativeEnum(Role)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Password do not match",
  }),
});

export const loginUserSchema = z.object({
  body: object({
    email: z
      .string({ required_error: "Email address is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Invalid email or password"),
  }),
});

export const verifyEmailSchema = z.object({
  params: object({
    verificationCode: z.string(),
  }),
});

export const updateUserSchema = z.object({
  body: object({
    name: z.string({}),
    email: z.string({}).email("Invalid email address"),
    password: z
      .string({})
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: z.string({}),
    role: z.optional(z.nativeEnum(Role)),
  })
    .partial()
    .refine((body) => body.password === body.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Password do not match",
    }),
});

export const forgotPasswordSchema = z.object({
  body: object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Email is invalid"),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    resetToken: z.string(),
  }),
  body: z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be more than 8 characters"),
      passwordConfirm: z.string({
        required_error: "Please confirm your password",
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Password do not match",
      path: ["passwordConfirm"],
    }),
});

// export type RegisterUserInput = Omit<
//   TypeOf<typeof createUserSchema>["body"],
//   "passwordConfirm"
// >;

export type CreateUserDTO = Omit<
  z.infer<typeof createUserSchema>["body"],
  "passwordConfirm"
>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>["body"];
export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>["params"];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>["body"];
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
