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

export const enrollmentUpdateValidation = (data) => {
  const enrollment = z
    .object({
      userId: z.string(),
      courseId: z.string(),
    })
    .partial()
    .strict();

  const parsed = enrollment.safeParse(data);

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
