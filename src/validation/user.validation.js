import z from "zod";

export const userValidation = (data) => {
  const user = z
    .object({
      fullName: z.string(),
      email: z.string().email(),
      password: z.string().min(4).max(25),
      role: z.enum(["user", "admin", "superadmin", "author"]).optional(),
      otpSecret: z.string().optional(),
      otpEnabled: z.boolean().default(false).optional(),
    })
    .safeParse(data);

  if (!user.success) {
    return {
      success: false,
      errors: user.error.errors,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: user.data,
  };
};

export const userUpdateValidation = (data) => {
  const user = z
    .object({
      fullName: z.string(),
      email: z.string().email(),
      password: z.string().min(4).max(25),
      role: z.enum(["user", "admin", "superadmin", "author"]).optional(),
      otpSecret: z.string().optional(),
      otpEnabled: z.boolean().default(false).optional(),
    })
    .partial()
    .strict();

  const parsed = user.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.errors,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: parsed.data,
  };
};
