import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Partner name is required"),
  description: Yup.string().required("Description is required"),
  website: Yup.string().url("Must be a valid URL").required("Website is required"),
  image: Yup.string().url("Must be a valid URL").required("Logo URL is required"),
  deep_link: Yup.string().required("Deep link is required"),
});

export const initialValues = {
  name: "",
  description: "",
  website: "",
  image: "",
  deep_link: "",
};
