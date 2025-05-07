import z from "zod";

export const paymentValidation = (data) => {
  const payment = z
    .object({
      userId: z.string(),
      courseId: z.string(),
      amount: z.number().min(0),
      status: z.enum(["pending", "paid", "failed"]),
      paymentMethod: z.enum(["cash", "card"]),
    })
    .safeParse(data);

  if (!payment.success) {
    return {
      success: false,
      errors: payment.error.errors,
      data: null,
    };
  }

  return {
    success: true,
    errors: null,
    data: payment.data,
  };
};
