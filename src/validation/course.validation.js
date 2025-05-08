import z from "zod";

export const courseValidation = (data) => {
  const course = z
    .object({
      title: z.string().min(4).max(25),
      description: z.string().min(4),
      price: z.number().min(0),
      categoryId: z.string(),
      userId: z.string(),
    })
    .safeParse(data);

  if (!course.success) {
    return {
      success: false,
      errors: course.error.errors,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: course.data,
  };
};

export const courseUpdateValidation = (data) => {
  const course = z
    .object({
      title: z.string().min(4).max(25),
      description: z.string().min(4),
      price: z.number().min(0),
      categoryId: z.string(),
      userId: z.string(),
    })
    .partial()
    .strict();

  const parsed = course.safeParse(data);

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
