import { body } from "express-validator"

export const createProductValidation = [
  body("name").trim().isLength({ min: 2, max: 200 }).withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("category").isIn(["PANTS", "TSHIRTS", "CAPS", "BAGS", "ACCESSORIES"]).withMessage("Invalid category"),

  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),

  body("sizes").optional().isArray().withMessage("Sizes must be an array"),

  body("colors").optional().isArray().withMessage("Colors must be an array"),
]

export const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("category").optional().isIn(["PANTS", "TSHIRTS", "CAPS", "BAGS", "ACCESSORIES"]).withMessage("Invalid category"),

  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
]

export const addReviewValidation = [
  body("reviewerName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Reviewer name must be between 2 and 100 characters"),

  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

  body("comment").trim().isLength({ min: 10, max: 1000 }).withMessage("Comment must be between 10 and 1000 characters"),
]
