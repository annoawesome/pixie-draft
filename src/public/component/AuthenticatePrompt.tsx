import React from "react";
import { authClient } from "../client/authClient";

export default function AuthenticatePrompt({
  setAuthenticated,
}: {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password } = Object.fromEntries(new FormData(e.target));

    if (typeof password === "string") {
      authClient.login(password).then(async () => {
        const apiToken = authClient.getApiToken();
        console.log(apiToken ? "Logged in" : "Wrong password");
        setAuthenticated(!!apiToken);
      });
    }
  };

  return (
    <form
      className="flex-column popup-form"
      id="login-form"
      onSubmit={onSubmit}
    >
      <h1>You need to login</h1>
      <div className="flex-column">
        <label htmlFor="password" className="text-secondary">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="input-secondary"
          id="login-password"
        />
      </div>
      <button type="submit" className="button-primary">
        Login
      </button>
    </form>
  );
}
