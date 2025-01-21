import { Fragment } from "react";
import { Card } from "react-bootstrap";
import placeholder from "../../assets/images/placeholder.jpg";

const UserImage = ({ src, altText = "User photo" }) => {
  return (
    <Fragment>
      {src ? (
        <Card.Img src={src} className="user-image" alt={altText} />
      ) : (
        <Card.Img src={placeholder} className="user-image" alt={altText} />
      )}
    </Fragment>
  );
};
export default UserImage;
