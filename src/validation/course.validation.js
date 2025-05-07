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
