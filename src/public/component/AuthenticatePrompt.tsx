import React from "react";
import { login } from "../api/authApi";

export default function AuthenticatePrompt() {
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password } = Object.fromEntries(new FormData(e.target));

    if (typeof password === "string") {
      login(password).then((success) => {
        console.log(success ? "Logged in" : "Wrong password");

        window.location.reload();
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
