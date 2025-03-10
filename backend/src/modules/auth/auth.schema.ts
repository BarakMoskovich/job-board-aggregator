import * as Yup from 'yup';

export const signupSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  name: Yup.string().required('Name is required'),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const refreshSchema = Yup.object({
  refreshToken: Yup.string().required('Refresh token is required'),
});

export type SignupInput = Yup.InferType<typeof signupSchema>;
export type LoginInput = Yup.InferType<typeof loginSchema>;
export type RefreshInput = Yup.InferType<typeof refreshSchema>;

export const $ref = (schemaName: string) => ({
  $ref: `#/components/schemas/${schemaName}`,
});
