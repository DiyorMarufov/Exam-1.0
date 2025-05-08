import { Course, User } from "../models/index.js";
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

  async getAllCourses(__, res) {
    try {
      const courses = await Course.find()
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
