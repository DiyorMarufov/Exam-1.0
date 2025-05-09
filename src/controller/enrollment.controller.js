import { Course, Enrollment, User } from "../models/index.js";
import {
  errorResponse,
  successResponse,
  sendEmail,
  verifyToken,
} from "../utils/index.js";
import {
  enrollmentUpdateValidation,
  enrollmentValidation,
} from "../validation/index.js";

export class EnrollmentController {
  async createEnrollment(req, res) {
    try {
      const { success, errors, data } = enrollmentValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { userId, courseId } = data;

      const { valid, expired, info } = verifyToken(
        req.cookies.refreshTokenUser
      );

      if (!valid) {
        return errorResponse(
          res,
          400,
          expired ? `Token expired` : `Invalid token`
        );
      }
      
      const user = await User.findById(info.sub);
      const course = await Course.findById(courseId);

      if (!course) {
        return errorResponse(
          res,
          404,
          `Course with ID ${course._id} not found`
        );
      }

      await sendEmail(
        user.email,
        `Course Enrollment`,
        `User ${user.fullName} successfully enrolled`
      );

      const newEnrollment = await Enrollment.create({
        userId,
        courseId,
      });

      return successResponse(res, 201, `success`, newEnrollment);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllEnrollments(__, res) {
    try {
      const enrollments = await Enrollment.find()
        .populate("userId")
        .populate("courseId");

      return successResponse(res, 200, `success`, enrollments);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getEnrollmentById(req, res) {
    const { id } = req.params;
    const enrollment = await EnrollmentController.findEnrollmentById(res, id);

    return successResponse(res, 200, `success`, enrollment);
  }

  async updateEnrollmentById(req, res) {
    try {
      const { id } = req.params;
      const enrollment = await EnrollmentController.findEnrollmentById(res, id);

      const { success, errors, data } = enrollmentUpdateValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }
      const updatedEnrollment = await Enrollment.findByIdAndUpdate(
        enrollment._id,
        {
          $set: data,
        },
        { new: true }
      );

      return successResponse(res, 200, `success`, updatedEnrollment);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deleteEnrollmentById(req, res) {
    try {
      const { id } = req.params;
      const enrollment = await EnrollmentController.findEnrollmentById(res, id);
      await Enrollment.findByIdAndDelete(enrollment._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findEnrollmentById(res, id) {
    if (!id) {
      return errorResponse(res, 400, `ID not found`);
    }

    const enrollment = await Enrollment.findById(id)
      .populate("userId")
      .populate("courseId");

    if (!enrollment) {
      return errorResponse(res, 404, `Enrollment not found`);
    }
    return enrollment;
  }
}
