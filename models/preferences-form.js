import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  favouriteTransportation: Yup.string().required("Required"),
  avoidedTransportation: Yup.string().required("Required"),
  transportationSubscription: Yup.boolean().required("Required"),
  prreferedRoute: Yup.string().required("Required"),
  usualRoute: Yup.boolean().required("Required"),
  routeHours: Yup.string().required("Required"),
  routesAlerts: Yup.boolean().required("Required"),
});

export const initialValues = {
  favouriteTransportation: "",
  avoidedTransportation: "",
  transportationSubscription: false,
  prreferedRoute: "",
  usualRoute: false,
  routeHours: "",
  routesAlerts: false,
};
