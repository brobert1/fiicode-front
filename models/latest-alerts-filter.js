import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  type: Yup.string(),
});

export const initialValues = {
  type: "all",
};
