/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

const Joi = require("joi");

const productSchema = Joi.object({
  // NOTE: id field will not be required because it will be generated by firebase upon successful validation of all other fields and will be referenced using the firebase base UUID instead
  id: Joi.string(),
  productName: Joi.string().required(),
  basePrice: Joi.number().required(),
  sizes: Joi.array().items(Joi.object({
    price: Joi.number().required(),
    name: Joi.string().required(),
  })).optional(),
  addons: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
  })).optional(),
  ingredients: Joi.array().items(Joi.string()),
  description: Joi.string().min(1),
  category: Joi.string().required(),
  // NOTE: This will be given by firebase storage
  imageUrl: Joi.string(),
  isFeatured: Joi.boolean().required().default(false),
  isPublished: Joi.boolean().required(),
  nutritionalInfo: Joi.object({
    calories: Joi.number().required(),
    carbohydrates: Joi.number().required(),
    fat: Joi.number().required(),
    fiber: Joi.number().required(),
    protein: Joi.number().required(),
    sugar: Joi.number().required(),
  }).optional(),
  preparationTime: Joi.number().required(),
});

module.exports = {
  productSchema,
};
