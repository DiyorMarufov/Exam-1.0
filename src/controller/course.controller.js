import { Category, Course, User } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/index.js";
import {
  courseUpdateValidation,
  courseValidation,
} from "../validation/index.js";

export class CourseController {
  async createCourse(req, res) {
    try {
      const { success, errors, data } = courseValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { title, description, price, categoryId, userId } = data;

      const author = await User.findById(userId);

      if (author.role !== "author") {
        return errorResponse(res, 403, `Only role author could be enrolled`);
      }

      const category = await Category.findById(userId);

      if (!category) {
        return errorResponse(
          res,
          404,
          `Category with ID ${category._id} not found`
        );
      }

      const newCourse = await Course.create({
        title,
        description,
        price,
        categoryId,
        userId,
      });

      return successResponse(res, 201, `success`, newCourse);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllCourses(req, res) {
    try {
      const { category, price_lte } = req.query;

      let filter = {};

      if (category) {
        const categoryDoc = await Category.findOne({ name: category });

        if (!categoryDoc) {
          return successResponse(res, 200, `No courses found`, []);
        }
        filter.categoryId = categoryDoc._id;
      }

      if (price_lte) {
        filter.price = { $lte: parseFloat(price_lte) };
      }

      const courses = await Course.find(filter)
        .populate("categoryId")
        .populate("userId");

      return successResponse(res, 200, `success`, courses);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getCourseById(req, res) {
    const { id } = req.params;
    const course = await CourseController.findCourseById(res, id);

    return successResponse(res, 200, `success`, course);
  }

  async updateCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await CourseController.findCourseById(res, id);

      const { success, errors, data } = courseUpdateValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }
      const updatedCourse = await Course.findByIdAndUpdate(
        course._id,
        {
          $set: data,
        },
        { new: true }
      );

      return successResponse(res, 200, `success`, updatedCourse);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deleteCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await CourseController.findCourseById(res, id);
      await Course.findByIdAndDelete(course._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findCourseById(res, id) {
    if (!id) {
      return errorResponse(res, 400, `ID not found`);
    }

    const course = await Course.findById(id)
      .populate("categoryId")
      .populate("userId");

    if (!course) {
      return errorResponse(res, 404, `Course not found`);
    }
    return course;
  }
}
