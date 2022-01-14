import "./MessageOrReport.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const MessageOrReport = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const type = query.get("type");
  const { session } = useSession();

  const onSubmit = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(
        type === "message"
          ? {
              ad_id: query.get("id"),
              messenger: session.data.id,
              receiver: query.get("owner"),
              message_content: values.content,
            }
          : {
              ad_id: query.get("id"),
              user_reporting: session.data.id,
              message_content: values.content,
            }
      ),
    });
    navigate(`/listing?id=${query.get("id")}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="messageWrapper">
        <h1>Insert message</h1>
        <textarea
          {...register("content", {
            required: {
              message: "Message is required",
              value: true,
            },
          })}
          className="messageInput"
          placeholder="message"
        />
        {errors?.content && <small>{errors.content.message}</small>}
        <button>{type === "message" ? "Message Listing" : "Report Listing"}</button>
      </div>
    </form>
  );
};

export default MessageOrReport;
