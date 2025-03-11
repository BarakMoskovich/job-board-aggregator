import * as Yup from 'yup';

export const validateSchema =
  (schema: Yup.ObjectSchema<any>) => async (data: any) => {
    try {
      await schema.validate(data, { abortEarly: false });
      return data;
    } catch (error: any) {
      throw new Error(error.errors.join(', '));
    }
  };
