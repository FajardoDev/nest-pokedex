import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(), // Es la url
  PORT: Joi.number().default(3005), // Es donde corre
  DEFAULT_LIMIT: Joi.number().default(6), // el limit de la paginación de la data de
});
