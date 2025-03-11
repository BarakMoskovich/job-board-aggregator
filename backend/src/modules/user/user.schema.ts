import * as Yup from 'yup';

export const preferencesSchema = Yup.object({
  jobTitles: Yup.array().of(Yup.string()).optional(),
  locations: Yup.array().of(Yup.string()).optional(),
  salaryMin: Yup.number().optional(),
  salaryMax: Yup.number().optional(),
  currency: Yup.string().optional(),
  emailNotifications: Yup.boolean().optional(),
  pushNotifications: Yup.boolean().optional(),
});

export type PreferencesInput = Yup.InferType<typeof preferencesSchema>;
