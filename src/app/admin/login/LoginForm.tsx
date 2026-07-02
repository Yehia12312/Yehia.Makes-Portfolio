"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="admin-login-form">
      {state?.error && <div className="form-error">{state.error}</div>}
      <div className="form-field">
        <label htmlFor="password">PASSWORD</label>
        <input id="password" type="password" name="password" autoFocus required />
      </div>
      <button type="submit" className="form-submit" disabled={pending}>
        {pending ? "CHECKING…" : "LOG IN →"}
      </button>
    </form>
  );
}
