import { UserType } from "../utils/utilities";
import RatingStars from "../rating/RatingStars";
import UserImage from "../common/UserImage";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaMinus } from "react-icons/fa";

const Review = ({ review, userType, onDelete }) => {
  const displayName =
    userType === UserType.PATIENT
      ? `Вы оценили ветеринара ${review.veterinarianName}`
      : `Автор отзыва: ${review.patientName}`;

  return (
    <div className="mb-4 position-relative">
      <div className="d-flex  me-5">
        {userType === UserType.VET ? (
          <UserImage
            src={review.patientImageUrl}
            alt={`Фото пользователя ${review.patientId}`}
          />
        ) : (
          <UserImage
            src={review.veterinarianImageUrl}
            alt={`Фото пользователя ${review.veterinarianId}`}
          />
        )}
        <div>
          <div className="d-flex align-items-center ms-3">
            <h5 className="title me-3">
              <RatingStars rating={review.stars} />
            </h5>
            {userType === UserType.PATIENT && (
              <OverlayTrigger overlay={<Tooltip>Удалить отзыв</Tooltip>}>
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0"
                  onClick={() => onDelete(review.id)}
                >
                  <FaMinus />
                </Button>
              </OverlayTrigger>
            )}
          </div>
          <div className="mt-1">
            <p className="review-text ms-4">{review.feedback}</p>
          </div>
          <div>
            <p className="ms-4">{displayName}</p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Review;
