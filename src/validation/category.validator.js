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
