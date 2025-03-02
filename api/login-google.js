import { store } from "@auth";
import { axios, router, toaster } from "@lib";
import { decode } from "jsonwebtoken";

const loginGoogle = async (data) => {
  const { token, needsPasswordSetup } = await axios.post("/login-google", data);
  const decoded = decode(token);
  if (!decoded) {
    throw new Error("Eroare! Nu te putem autentifica în acest moment");
  }
  store.dispatch({ type: "SET", jwt: token });
  const { role, hasPreferences } = decoded;
  if (!role) {
    throw new Error("Error! We cannot log you in at the moment");
  }

  // Notify user and other actions
  toaster.success("Autentificare reușită");
  if (needsPasswordSetup) {
    toaster.error("Change your password from your profile page");
  }
  if (role == "client" && !hasPreferences) {
    router.push("/client/preferences");
    return;
  }
  router.push(`/${role}`);
};

export default loginGoogle;
