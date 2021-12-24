import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./MessageThread.css";
import { useSession } from "../contexts/SessionContext";

const MessageThread = () => {
  const { session } = useSession();

  const query = new URLSearchParams(window.location.search);

  const otherUser = query.get("otherUser");

  const adId = query.get("adId");

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [data, setData] = useState([]);
  useEffect(async () => {
    const response = await fetch(
      `https://127.0.0.1:8393/api/message/allMessages?userId=${session.data.id}&otherid=${otherUser}&adId=${adId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      }
    );

    if (response.status == 204) {
      setData([]);
    }
    const responseArr = (await response.json()).data;
    setData(responseArr);
  }, []);

  const onSubmit = async (values) => {
    await fetch(`https://127.0.0.1:8393/api/message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        messenger: session.data.id,
        receiver: otherUser,
        message_content: values.message,
        ad_id: adId,
      }),
    });
    const newMessages = [...data];
    newMessages.push({
      messenger: session.data.id,
      receiver: otherUser,
      message_content: values.message,
      ad_id: adId,
      sent_at: new Date(Date.now()),
    });
    setData(newMessages);
    navigate(`/messageThread?otherUser=${otherUser}&adId=${adId}`);
  };

  const registerInput = (name, message, value) => {
    return register(name, {
      required: {
        message,
        value,
      },
    });
  };

  return (
    <div>
      {data.map((e) => (
        <div align={session.data.id === e.messenger ? "right" : "left"}>
          <div className="singleMessage">
            <div className={session.data.id === e.messenger ? "userIsMessenger" : "userIsReceiver"}>
              <h1>{e.message_content}</h1>
              <h1 className="authorTime">
                {new Intl.DateTimeFormat("en-GB", {
                  dateStyle: "full",
                  timeStyle: "long",
                }).format(new Date(e.sent_at))}
              </h1>
            </div>
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className="sendText">
        <div>
          <textarea {...registerInput("message", "Enter message", true)}></textarea>
          {errors?.message && <small>{errors?.message.message}</small>}
          <button disabled={isSubmitting}>{isSubmitting ? "Sending message..." : "Send Message"}</button>
        </div>
      </form>
    </div>
  );
};

export default MessageThread;
