import z from "zod";

export const categoryValidation = (data) => {
  const category = z
    .object({
      name: z.string(),
      description: z.string().min(5),
    })
    .safeParse(data);

  if (!category.success) {
    return {
      success: false,
      errors: category.error.errors,
      data: null,
    };
  }
  return {
    success: true,
    error: null,
    data: category.data,
  };
};

export const categoryUpdateValidation = (data) => {
  const category = z
    .object({
      name: z.string(),
      description: z.string().min(5),
    })
    .partial()
    .strict();

  const parsed = category.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.errors,
      data: null,
    };
  }
  return {
    success: true,
    error: null,
    data: parsed.data,
  };
};
