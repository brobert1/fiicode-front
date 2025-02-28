import { store } from "@auth";
import { axios, router, toaster } from "@lib";
import { decode } from "jsonwebtoken";

const login = async (ref, data) => {
  try {
    // Execute google recaptcha
    data["g-recaptcha-response"] = await ref.current.executeAsync();

    const { token } = await axios.post("login", data);
    if (!decode(token)) {
      throw new Error("Error! We cannot log you in at the moment");
    }
    store.dispatch({ type: "SET", jwt: token });

    // Decode token to get user role
    const { role, hasPreferences } = decode(token) || {};
    if (!role) {
      throw new Error("Error! We cannot log you in at the moment");
    }

    // Notify user and other actions
    toaster.success("Login successful");

    if (role == "client" && !hasPreferences) {
      router.push("/client/preferences");
      return;
    }

    router.push(`/${role}`);
  } catch (err) {
    // Handle error
    toaster.error(err.message);
  } finally {
    // Reset recaptcha
    ref.current.reset();
  }
};

export default login;
