import "./MainPage.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();

  const onSubmit = (values) => {
    navigate(`/listings?title=${values.title}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="findJob">
        <h1>Find your perfect job!</h1>
        <input
          type="text"
          placeholder="Input type of job..."
          {...register("title", {
            required: {
              message: "Job is required",
              value: true,
            },
          })}
        />
        <button className="findJobButton" type="submit">
          Find Job!
        </button>
      </div>
    </form>
  );
};
export default MainPage;
