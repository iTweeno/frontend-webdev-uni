import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./Listings.css";
import SingleListingForList from "../components/SingleListingForList.jsx";

const Listings = () => {
  const [data, setData] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const title = query.get("title");
  let skip = query.get("skip");

  const clickPagination = async (event) => {
    skip = event.selected;
    navigate(`/listings?title=${title}&skip=${skip}`);
    getData();
  };

  const getData = async () => {
    const response = await fetch(`https://127.0.0.1:8393/api/ad?title=${title}&skip=${skip}`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    });
    if (response.status == 204) {
      return setData(1);
    }
    const responseJson = (await response.json()).data;

    setData(responseJson);
  };

  useEffect(async () => {
    getData();
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
              type={e.ad_type}
              description={e.description}
              company={e.company}
              key={e.id}
            />
          </Link>
        ))}
      </div>
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        pageCount={Math.ceil(data.count / 10)}
        onPageChange={clickPagination}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Listings;
