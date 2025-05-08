import { Category } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/index.js";
import {
  categoryUpdateValidation,
  categoryValidation,
} from "../validation/index.js";

export class CategoryController {
  async createCategory(req, res) {
    try {
      const { success, errors, data } = categoryValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { name, description } = data;

      const newCategory = await Category.create({
        name,
        description,
      });

      return successResponse(res, 201, `success`, newCategory);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllCategories(__, res) {
    try {
      const categories = await Category.find();

      return successResponse(res, 200, `success`, categories);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await CategoryController.findCategoryById(res, id);

    return successResponse(res, 200, `success`, category);
  }

  async updateCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryController.findCategoryById(res, id);

      const { success, errors, data } = categoryUpdateValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        category._id,
        {
          $set: data,
        },
        { new: true }
      );

      return successResponse(res, 200, `success`, updatedCategory);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deleteCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryController.findCategoryById(res, id);
      await Category.findByIdAndDelete(category._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findCategoryById(res, id) {
    if (!id) {
      return errorResponse(res, 400, `ID not found`);
    }

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, 404, `Category not found`);
    }
    return category;
  }
}
