import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Col, Row, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import UserProfile from "./UserProfile";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getUserById, deleteUser } from "./UserService";
import { deleteUserPhoto } from "../modals/ImageUploaderService";
import AlertMessage from "../common/AlertMessage";
import Review from "../review/Review";
import UserAppointments from "../appointment/UserAppointments";
import CustomPieChart from "../charts/CustomPieChart";
import { formatAppointmentStatus } from "../utils/utilities";
import NoDataAvailable from "../common/NoDataAvailable";
import { logout } from "../auth/AuthService";
import { deleteReview } from "../review/ReviewService";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [activeKey, setActiveKey] = useState(() => {
    const storedActiveKey = localStorage.getItem("activeKey");
    return storedActiveKey ? storedActiveKey : "profile";
  });
  const [deletedReviewId, setDeletedReviewId] = useState(null);
  const [failedReviewId, setFailedReviewId] = useState(null);

  const [activeTab, setActiveTab] = useState("status");

  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const { userId } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data.data);
        setAppointments(data.data.appointments);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, [userId]);

  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const statusCounts = appointments.reduce((acc, appointment) => {
        const status = appointment.status;
        if (acc[status]) {
          acc[status] += 1;
        } else {
          acc[status] = 1;
        }
        return acc;
      }, {});

      const transformedData = Object.entries(statusCounts).map(
        ([status, count]) => ({
          name: formatAppointmentStatus(status),
          status: status,
          value: count,
        })
      );

      setAppointmentData(transformedData);
    } else {
      setAppointmentData([]);
    }
  }, [appointments]);

  const handleRemovePhoto = async () => {
    try {
      const response = await deleteUserPhoto(user.photoId, userId);
      window.location.reload();
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser(userId);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleTabSelect = (key) => {
    setActiveKey(key);
    localStorage.setItem("activeKey", key);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);

      setDeletedReviewId(reviewId);

      setTimeout(() => {
        setUser((prevUser) => ({
          ...prevUser,
          reviews: prevUser.reviews.filter((review) => review.id !== reviewId),
        }));
        setDeletedReviewId(null);
      }, 3000);
    } catch (error) {
      setFailedReviewId(reviewId);
      setTimeout(() => {
        setFailedReviewId(null);
      }, 3000);
    }
  };

  return (
    <Container className="mt-2 user-dashboard">
      <Tabs
        className="mb-2"
        justify
        activeKey={activeKey}
        onSelect={handleTabSelect}
      >
        <Tab eventKey="profile" title={<h3>Профиль</h3>}>
          <Col>
            {showErrorAlert && (
              <AlertMessage type={"danger"} message={errorMessage} />
            )}
            {showSuccessAlert && (
              <AlertMessage type={"success"} message={successMessage} />
            )}

            {user && (
              <UserProfile
                user={user}
                handleRemovePhoto={handleRemovePhoto}
                handleDeleteAccount={handleDeleteAccount}
              />
            )}
          </Col>
        </Tab>

        <Tab eventKey="status" title={<h3>Статусы приёмов</h3>}>
          <Row>
            <Col>
              {appointmentData && appointmentData.length > 0 ? (
                <CustomPieChart data={appointmentData} />
              ) : (
                <NoDataAvailable dataType={"appointment data"} />
              )}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="appointments" title={<h3>Список приёмов</h3>}>
          <Row>
            <Col>
              {user && (
                <React.Fragment>
                  {appointments && appointments.length > 0 ? (
                    <UserAppointments user={user} appointments={appointments} />
                  ) : (
                    <NoDataAvailable dataType={"appointment data"} />
                  )}
                </React.Fragment>
              )}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="reviews" title={<h3>Отзывы</h3>}>
          <Container className="d-flex justify-content-center align-items-center">
            <Card className="mt-5 mb-4 review-card">
              <h4 className="text-center mb-2">Ваши отзывы</h4>
              <hr />
              <Row>
                <Col>
                  {user && user.reviews && user.reviews.length > 0 ? (
                    user.reviews.map((review) =>
                      review.id === deletedReviewId ? (
                        <div
                          key={review.id}
                          className="review-item mb-3 d-flex justify-content-center align-items-center"
                          style={{ height: "100px" }}
                        >
                          <p className="text-success text-center">
                            Отзыв успешно удалён!
                          </p>
                        </div>
                      ) : review.id === failedReviewId ? (
                        <div
                          key={review.id}
                          className="review-item mb-3 d-flex justify-content-center align-items-center"
                          style={{ height: "100px" }}
                        >
                          <p className="text-danger text-center">
                            Ошибка при удалении отзыва!
                          </p>
                        </div>
                      ) : (
                        <Review
                          key={review.id}
                          review={review}
                          userType={user.userType}
                          onDelete={handleDeleteReview}
                        />
                      )
                    )
                  ) : (
                    <NoDataAvailable dataType={"review data"} />
                  )}
                </Col>
              </Row>
            </Card>
          </Container>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
