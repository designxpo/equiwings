import { body } from "express-validator"

export const registerValidation = [
  body("firstName").trim().isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters"),

  body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("phoneNumber").isMobilePhone("any").withMessage("Please provide a valid phone number"),

  body("countryCode")
    .matches(/^\+\d{1,4}$/)
    .withMessage("Please provide a valid country code"),
]

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
]

export const verifyEmailValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("OTP must be 6 digits"),
]

export const forgotPasswordValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
]

export const resetPasswordValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("OTP must be 6 digits"),

  body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]
