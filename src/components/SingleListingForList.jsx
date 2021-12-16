import "./SingleListingForList.css";

const SingleAdForList = ({ title, location, company, salary, description, type }) => {
  return (
    <div className="listingWrapper">
      <div className="listingInfo">
        <h1 className="title">{title}</h1>
        <h1 className="location">{location}</h1>
        <h1 className="company">{company}</h1>
        {type === "paid" ? <h1 className="salary">{salary}</h1> : <h1 className="salary">{type.charAt(0).toUpperCase() + type.slice(1)}</h1>}
        <h1 className="description">
          {`${description?.length > 200 ? `${description.substring(0, 200)}...` : description}`}
        </h1>
      </div>
    </div>
  );
};

export default SingleAdForList;
