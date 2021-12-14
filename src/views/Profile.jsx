import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Profile.css";
import { useSession } from "../contexts/SessionContext";

const Profile = () => {
  const query = new URLSearchParams(window.location.search);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const { session } = useSession();

  useEffect(async () => {
    if (query.get("type") === "messages") {
      const response = await fetch(`https://127.0.0.1:8393/api/message/allMessages?id=${session.data.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      });

      if (response.status == 204) {
        setData([]);
      }
      const responseArr = (await response.json()).data;
      const sortedArray = responseArr
        .filter(
          (e, i) =>
            responseArr.indexOf(
              responseArr.find((ee) => [ee.messenger, ee.receiver].includes(e.messenger) && e.ad_id === ee.ad_id)
            ) === i
        );
        console.log(sortedArray)
      setData(sortedArray);
    }
  }, []);

  const registerInput = (name, message, value) => {
    return register(name, {
      required: {
        message,
        value,
      },
    });
  };

  const submitProfileChange = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/user?id=${session.data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        birthday: values.birthday,
        first_name: values.firstname,
        last_name: values.lastname,
        phone_number: values.phonenumber,
        company: values.company,
        profile_picture: values.profilepicture,
      }),
    })
      .then(() => {
        navigate("/profile?type=editprofile");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="profileWrapper">
      <div className="leftSide">
        <div className="options">
          <Link to="/profile?type=messages" style={{ textDecoration: "none", color: "white" }}>
            <h1>Messages</h1>
          </Link>
          <Link to="/profile?type=editprofile" style={{ textDecoration: "none", color: "white" }}>
            <h1>Edit Profile</h1>
          </Link>
          <Link to="/profile?type=editlistings" style={{ textDecoration: "none", color: "white" }}>
            <h1>Edit Listings</h1>
          </Link>
        </div>
      </div>
      <div className="rightSide">
        {query.get("type") === "editprofile" ? (
          <form className="rightSide" onSubmit={handleSubmit(submitProfileChange)}>
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
              <input placeholder="Profile Picture Link" {...registerInput("profilepicture", "", false)} />
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
              {isSubmitting ? "Editing profile..." : "Edit Profile"}
            </button>
          </form>
        ) : query.get("type") === "messages" ? (
          <div className="messagesWrapper">
            {data.map((e) => (
              <Link
                to={`/messagethread?otherUser=${
                  e.userr_message_messengerTouserr.id === session.data.id ? e.receiver : e.messenger
                }&adId=${e.ad_id}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="message">
                  <h1 className="messageContent">{`${
                    e.message_content.length > 60 ? `${e.message_content.substring(0, 60)}...` : e.message_content
                  }`}</h1>
                  <h1 className="authorTime">
                    Sent by:
                    {`${e.userr_message_messengerTouserr.first_name} ${e.userr_message_messengerTouserr.last_name} ${
                          e.userr_message_messengerTouserr.last_name
                        }\n ${new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "full",
                          timeStyle: "long",
                        }).format(new Date(e.sent_at))}`}
                  </h1>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Profile;
