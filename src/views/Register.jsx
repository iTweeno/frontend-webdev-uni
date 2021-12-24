import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const navigate = useNavigate();

  const registerInput = (name, message, value) => {
    return register(name, {
      required: {
        message,
        value,
      },
    });
  };

  const onSubmit = async (values) => {
    const body = {
      email: values.email,
      password: values.password,
      birthday: values.birthday,
      first_name: values.firstname,
      last_name: values.lastname,
      phone_number: values.phonenumber,
      company: values.company,
      profile_picture: values.imageFile[0],
    };
    const formData = new FormData();
    for (const key of Object.keys(body)) {
      formData.append(key, body[key]);
    }
    await fetch(`https://127.0.0.1:8393/api/user`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: formData,
    })
      .then(async (e) => {
        if (!e.ok) {
          return setError("password", {
            message: (await e.json()).message,
          });
        }
        navigate("/login");
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="registerWrapper">
        <div className="register">
          <h1>Register an account</h1>
          <div className="inputs">
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
            <input placeholder="First name" {...registerInput("firstname", "Enter first Name", true)} />
            {errors?.firstname && <small>{errors.firstname.message}</small>}
            <input placeholder="Last Name" {...registerInput("lastname", "Enter last Name", true)} />
            {errors?.lastname && <small>{errors.lastname.message}</small>}
            <input placeholder="Phone Number" {...registerInput("phonenumber", "Enter Phone Number", true)} />
            {errors?.phonenumber && <small>{errors.phonenumber.message}</small>}
            <input placeholder="Birthday" {...registerInput("birthday", "Enter birthday", true)} />
            {errors?.birthday && <small>{errors.birthday.message}</small>}
            <input placeholder="Company" {...registerInput("company", "Enter Company Name", true)} />
            {errors?.company && <small>{errors.company.message}</small>}
            <input type="file" {...registerInput("imageFile", "Enter Image", false)} />
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
          </div>
          <button className="registerButton" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "registering..." : "Register"}
          </button>
        </div>
      </div>
    </form>
  );
};
export default Register;
