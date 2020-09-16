import joi from "@hapi/joi";

export const loginSchema = joi.object({
  email: joi.string().empty().required(),
  password: joi.string().empty().required(),
  name: joi
    .string()
    .pattern(/^[A-Za-z]{1,20}$/)
    .required(),

  lastname: joi
    .string()
    .pattern(/^[A-Za-z]{1,20}$/)
    .required(),
  id: joi.string().empty().required(),
  city: joi.string().empty().required(),
  street: joi.string().empty().required(),
});
