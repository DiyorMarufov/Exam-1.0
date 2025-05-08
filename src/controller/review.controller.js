import { Review } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/index.js";
import {
  reviewUpdateValidation,
  reviewValidation,
} from "../validation/index.js";

export class ReviewController {
  async createReview(req, res) {
    try {
      const { success, errors, data } = reviewValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { userId, courseId, rating, comment } = data;

      const newReview = await Review.create({
        userId,
        courseId,
        rating,
        comment,
      });

      return successResponse(res, 201, `success`, newReview);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllReviews(__, res) {
    try {
      const reviews = await Review.find()
        .populate("userId")
        .populate("courseId");

      return successResponse(res, 200, `success`, reviews);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getReviewById(req, res) {
    const { id } = req.params;
    const review = await ReviewController.findReviewById(res, id);

    return successResponse(res, 200, `success`, review);
  }

  async updateReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await ReviewController.findReviewById(res, id);

      const { success, errors, data } = reviewUpdateValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }
      const updatedReview = await Review.findByIdAndUpdate(
        review._id,
        {
          $set: data,
        },
        { new: true }
      );

      return successResponse(res, 200, `success`, updatedReview);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deleteReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await ReviewController.findReviewById(res, id);
      await Review.findByIdAndDelete(review._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findReviewById(res, id) {
    if (!id) {
      return errorResponse(res, 400, `ID not found`);
    }

    const review = await Review.findById(id)
      .populate("userId")
      .populate("courseId");

    if (!review) {
      return errorResponse(res, 404, `Review not found`);
    }
    return review;
  }
}
