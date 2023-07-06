import { useEffect } from "react";
import Cookies from "js-cookie";

export const setAuthToken = (token: string) => {
  // Set the token as an HTTP-only cookie
  Cookies.set("authToken", token, {
    secure: true,
    sameSite: "strict",
    httpOnly: true,
  });
};

const CallbackPage: React.FC = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    console.log({ token });
    if (token) {
      setAuthToken(token);
      console.log("Set!");
    } else {
      console.error("No token found!");
    }
  }, []);

  return <div>Callback Page</div>;
};

export default CallbackPage;
