import z from "zod";

export const enrollmentValidation = (data) => {
  const enrollment = z
    .object({
      userId: z.string(),
      courseId: z.string(),
    })
    .safeParse(data);

  if (!enrollment.success) {
    return {
      success: false,
      errors: enrollment.error.errors,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: enrollment.data,
  };
};
