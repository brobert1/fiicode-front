import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  favourite_transportation: Yup.string().required("Required"),
  avoided_transportation: Yup.string().required("Required"),
  transportation_subscription: Yup.boolean().required("Required"),
  prrefered_route: Yup.string().required("Required"),
  usual_route: Yup.boolean().required("Required"),
  route_hours: Yup.string().required("Required"),
  routes_alerts: Yup.boolean().required("Required"),
});

export const initialValues = {
  favourite_transportation: "",
  avoided_transportation: "",
  transportation_subscription: false,
  prrefered_route: "",
  usual_route: false,
  route_hours: "",
  routes_alerts: false,
};
