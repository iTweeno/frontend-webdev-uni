import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const navigate = useNavigate();
  const { refreshSession } = useSession();

  const onSubmit = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          return setError("password", {
            message: (await e.json()).message,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
    await refreshSession();
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="loginWrapper">
        <div className="login">
          <h1>Login to your account</h1>
          <div className="usernamepassword">
            <input
              placeholder="Email"
              {...register("email", {
                required: {
                  message: "Email is required",
                  value: true,
                },
                pattern: {
                  value: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g,
                  message: "No valid email provided",
                },
              })}
            />
            {errors?.email && <small>{errors.email.message}</small>}
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: {
                  message: "Password is required",
                  value: true,
                },
              })}
            />
            {errors?.password && <small>{errors.password.message}</small>}
            <button
              className="loginButton"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Login;
