import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Profile.css";
import { useSession } from "../contexts/SessionContext";
import SingleListingForList from "../components/SingleListingForList.jsx";

const Profile = () => {
  const query = new URLSearchParams(window.location.search);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [dataMessages, setDataMessages] = useState([]);

  const [adSelected, setAdSelected] = useState(null);

  const [dataListings, setdataListings] = useState([]);

  const navigate = useNavigate();

  const { session } = useSession();

  const type = query.get("type");

  useEffect(async () => {
    const responseMessages = await fetch(`https://127.0.0.1:8393/api/message/allMessages?userId=${session.data.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (responseMessages.status == 204) {
      setDataMessages([]);
    }
    const responseArrMessages = (await responseMessages.json()).data;
    const sortedArray = responseArrMessages.filter(
      (e, i) =>
        responseArrMessages.indexOf(
          responseArrMessages.find((ee) => [ee.messenger, ee.receiver].includes(e.messenger) && e.ad_id === ee.ad_id)
        ) === i
    );

    setDataMessages(sortedArray);

    const responseListings = await fetch(`https://127.0.0.1:8393/api/ad?owner=${session.data.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    const value = await responseListings.json();

    if (responseListings.status == 204) {
      setdataListings([]);
    }

    setdataListings(value.data);
  }, []);

  const registerInput = (name, message, value) => {
    return register(name, {
      required: {
        message,
        value,
      },
    });
  };

  const addInput = (placeholder, name, message) => {
    return (
      <div className="individualInputs">
        <input placeholder={placeholder} {...registerInput(name, message, true)} />
        {errors[name] && <small>{errors[name].message}</small>}
      </div>
    );
  };

  const submitProfileChange = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/user?userId=${session.data.id}`, {
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

  const deleteAd = async () => {
    await fetch(`https://127.0.0.1:8393/api/ad?adId=${adSelected}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    })
      .then(() => {
        navigate("/profile?type=editlistings");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const submitListingChanges = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/ad?adId=${adSelected}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        title: values.title,
        salary: values.salary,
        currency: values.currency,
        description: values.description,
        location: values.location,
        ad_type: values.type,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          return setError("password", {
            message: (await e.json()).message,
          });
        }
        navigate("/");
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
        {type === "editprofile" ? (
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
        ) : type === "messages" ? (
          <div className="messagesWrapper">
            {dataMessages.map((e) => (
              <Link
                key={e.id}
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
        ) : type === "editlistings" ? (
          <div className="editListingWrapper">
            <div className="listings">
              {dataListings.map((e) => (
                <button onClick={() => setAdSelected(e.id)}>
                  <SingleListingForList
                    title={e.title}
                    salary={`${e.salary}${e.currency}`}
                    location={e.location}
                    type={e.ad_type}
                    description={e.description}
                    company={e.company}
                    key={e.id}
                  />
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit(submitListingChanges)}>
              <div className="inputs">
                {addInput("Title", "title", "Enter title")}
                {addInput("Salary", "salary", "Enter Salary")}
                {addInput("Currency", "currency", "Enter Currency")}
                {addInput("Location", "location", "Enter Location")}
                <div className="individualInputs">
                  <label>Select type of ad:</label>
                  <select {...registerInput("type", "Insert input", true)}>
                    <option value="paid">Paid</option>
                    <option value="internship">Internship</option>
                    <option value="volunteering">Volunteering</option>
                  </select>
                </div>
                <div className="individualInputs">
                  <textarea
                    className="descriptionInput"
                    placeholder="Description"
                    {...registerInput("description", "Enter description", true)}
                  />
                  {errors.description && <small>{errors.description.message}</small>}
                </div>
                <button className="postListingButton" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Edit listing..." : "Edit listing!"}
                </button>
                <button className="deleteAdButton" type="a" onClick={deleteAd}>
                  Delete Ad!
                </button>
              </div>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Profile;
