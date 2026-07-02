import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="logo" style={{ marginBottom: 28 }}>
          <div className="logo-mark">
            <span>Y</span>
          </div>
          YEHIA.MAKES ADMIN
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
