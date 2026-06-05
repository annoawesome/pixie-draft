import React from "react";

export default function AuthenticatePrompt() {
  return (
    <div className="popup-form">
      <h1>You need to login</h1>
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="login-password" />
      <button type="button">Login</button>
    </div>
  );
}
