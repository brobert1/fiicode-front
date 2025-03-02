import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  changePassword: Yup.string()
    .trim()
    .required('Password is required')
    .min(10, 'Password must be at least 10 characters'),
  confirmPassword: Yup.string()
    .trim()
    .required('Password is required')
    .oneOf([Yup.ref('changePassword'), null], 'Passwords do not match'),
});

export const initialValues = {
  changePassword: '',
  confirmPassword: '',
};
