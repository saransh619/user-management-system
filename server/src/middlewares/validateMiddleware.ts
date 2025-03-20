import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

const validate = (schema: ObjectSchema): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    next();
  };
};

export default validate;
