import { useState, useEffect } from "react";
import "./Listing.css";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const Listing = () => {
  const [dataAPI, setdataAPI] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const { session } = useSession();
  useEffect(async () => {
    const response = await fetch(`https://127.0.0.1:8393/api/ad?id=${query.get("id")}`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    setdataAPI(await response.json());
  }, []);

  if (!dataAPI) {
    return <h1 className="loading">Loading...</h1>;
  }
  const { data } = dataAPI;

  const handleClick = (type, id, owner) => navigate(`/sendMessage?type=${type}&id=${id}&owner=${owner}`);

  const ListingFields = ({ objKey, value }) => {
    return (
      <div>
        <div className="keyValue">
          <h1 className="key">{objKey}</h1>
          <h1 className="value">{value}</h1>
        </div>
        <hr />
      </div>
    );
  };

  return (
    <div className="listingWrapper">
      <ListingFields objKey="Title" value={data.title} />
      <ListingFields objKey="Location" value={`${data.location}`} />
      <ListingFields objKey="Salary" value={`${data.salary}${data.currency}`} />
      <ListingFields objKey="Description" value={data.description} />
      <ListingFields objKey="Ad Owner" value={`${data.userr.first_name} ${data.userr.last_name}`} />
      <ListingFields objKey="Company" value={data.userr.company} />
      <ListingFields
        objKey="Last time updated"
        value={new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "long",
        }).format(new Date(data.last_time_updated))}
      />
      {session.data?.id == null ? (
        ""
      ) : (
        <div className="listingButtons">
          {" "}
          <button onClick={() => handleClick("message", data.id, data.owner)}>Message listing</button>
          <button className="reportButton" onClick={() => handleClick("report", data.id, data.owner)}>
            Report listing
          </button>
        </div>
      )}
    </div>
  );
};

export default Listing;
