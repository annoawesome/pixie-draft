import React from "react";
import { login } from "../api/authApi";

export default function AuthenticatePrompt({
  setApiToken,
}: {
  setApiToken: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password } = Object.fromEntries(new FormData(e.target));

    if (typeof password === "string") {
      login(password).then((apiToken) => {
        console.log(apiToken ? "Logged in" : "Wrong password");

        // window.location.reload();
        setApiToken(apiToken);
      });
    }
  };

  return (
    <form className="popup-form" onSubmit={onSubmit}>
      <h1>You need to login</h1>
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="login-password" />
      <button type="submit">Login</button>
    </form>
  );
}
