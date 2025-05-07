import z from "zod";

export const reviewValidation = (data) => {
  const review = z
    .object({
      userId: z.string(),
      courseId: z.string(),
      rating: z.number().min(0),
      comment: z.string().min(4),
    })
    .safeParse(data);

  if (!review.success) {
    return {
      success: false,
      errors: review.error.errors,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: review.data,
  };
};
