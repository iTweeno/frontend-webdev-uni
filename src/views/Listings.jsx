import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Listings.css";
import SingleListingForList from "../components/SingleListingForList.jsx";

const Listings = () => {
  const [data, setData] = useState(null);
  const query = new URLSearchParams(window.location.search);
  useEffect(async () => {
    const response = await fetch(
      `https://127.0.0.1:8393/api/ad?title=${query.get("title")}&skip=0`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      }
    );
    if (response.status == 204) {
      setData(1);
    }
    setData(await response.json());
  }, []);

  if (!data) {
    return <h1 className="loading">Loading...</h1>;
  } else if (data === 1) {
    return <h1 className="loading">Nothing found :(</h1>;
  }
  return (
    <div>
      <h1 className="foundListingsTitle">Found ads for criteria:</h1>
      <div className="listingList">
        {data.data.map((e) => (
          <Link to={`/listing?id=${e.id}`} key={e.id}>
            <SingleListingForList
              title={e.title}
              salary={`${e.salary}${e.currency}`}
              location={e.location}
              description={e.description}
              company={e.company}
              key={e.id}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Listings;
