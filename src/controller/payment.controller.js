import { Payment } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/index.js";
import {
  paymentUpdateValidation,
  paymentValidation,
} from "../validation/index.js";

export class PaymentController {
  async createPayment(req, res) {
    try {
      const { success, errors, data } = paymentValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { userId, courseId, amount, status, paymentMethod } = data;

      const newPayment = await Payment.create({
        userId,
        courseId,
        amount,
        status,
        paymentMethod,
      });

      return successResponse(res, 201, `success`, newPayment);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllPayments(__, res) {
    try {
      const payments = await Payment.find()
        .populate("userId")
        .populate("courseId");

      return successResponse(res, 200, `success`, payments);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getPaymentById(req, res) {
    const { id } = req.params;
    const payment = await PaymentController.findPaymentById(res, id);

    return successResponse(res, 200, `success`, payment);
  }

  async updatePaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await PaymentController.findPaymentById(res, id);

      const { success, errors, data } = paymentUpdateValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }
      const updatedPayment = await Payment.findByIdAndUpdate(
        payment._id,
        {
          $set: data,
        },
        { new: true }
      );

      return successResponse(res, 200, `success`, updatedPayment);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deletePaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await PaymentController.findPaymentById(res, id);
      await Payment.findByIdAndDelete(payment._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findPaymentById(res, id) {
    if (!id) {
      return errorResponse(res, 400, `ID not found`);
    }

    const payment = await Payment.findById(id)
      .populate("userId")
      .populate("courseId");

    if (!payment) {
      return errorResponse(res, 404, `Payment not found`);
    }
    return payment;
  }
}
