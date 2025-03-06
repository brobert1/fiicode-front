import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  type: Yup.string(),
  location: Yup.object().shape({
    latitude: Yup.number(),
    longitude: Yup.number(),
  }),
});

export const initialValues = {
  type: "",
  location: {
    latitude: 0,
    longitude: 0,
  },
};
