import "./PostListing.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const PostListing = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/ad`, {
      method: "POST",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="postListingWrapper">
        <div className="postListing">
          <h1>Post a listing</h1>
          <div className="postListingInputs">
            {addInput("Title", "title", "Enter title")}
            {addInput("Salary", "salary", "Enter Salary")}
            {addInput("Currency", "currency", "Enter Currency")}
            {addInput("Location", "location", "Enter Location")}
            <div className="individualInputs">
              <label for="type">Select type of ad:</label>
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
              {isSubmitting ? "Posting listing..." : "Post listing!"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default PostListing;
