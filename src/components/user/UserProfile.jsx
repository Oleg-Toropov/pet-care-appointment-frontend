import React, { useState, useEffect } from "react";
import UserImage from "../common/UserImage";
import { Link } from "react-router-dom";
import ImageUploaderModal from "../modals/ImageUploaderModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import { Col, Row, Card, Button, Container } from "react-bootstrap";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import style from "../../components/user/UserProfile.module.css";
import { getBiographyById } from "../veterinarian/VeterinarianService";

const UserProfile = ({ user, handleRemovePhoto, handleDeleteAccount }) => {
  const [showImageUploaderModal, setShowImageUploaderModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [biography, setBiography] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const isCurrentUser = user.id == currentUserId;

  const userTypeLabels = {
    ADMIN: "Администратор",
    PATIENT: "Владелец домашнего животного",
    VET: "Ветеринар",
  };

  useEffect(() => {
    const fetchBiography = async () => {
      if (user.userType === "VET") {
        setIsLoading(true);
        try {
          const biographyResult = await getBiographyById(user.id);
          setBiography(biographyResult.data?.biography || null);
        } catch (error) {
          console.error("Ошибка загрузки биографии:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBiography();
  }, [user]);

  const handleShowImageUploaderModal = () => setShowImageUploaderModal(true);
  const handleCloseImageUploaderModal = () => setShowImageUploaderModal(false);

  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);
  const handleCloseChangePasswordModal = () =>
    setShowChangePasswordModal(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleShowDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteAndCloseModal = async () => {
    await handleDeleteAccount();
    setShowDeleteModal(false);
  };

  return (
    <Container>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteAndCloseModal}
        itemToDelete={"аккаунт пользователя"}
      />
      <React.Fragment>
        <Row>
          <Col md={3}>
            <Card className="text-center mb-3 shadow">
              <Card.Body>
                <UserImage
                  src={user.photoUrl}
                  alt={`Фото пользователя ${user.id}`}
                />
              </Card.Body>

              {isCurrentUser && (
                <div className="text-center">
                  <p>
                    <Link to={"#"} onClick={handleShowImageUploaderModal}>
                      Загрузить фотографию
                    </Link>
                  </p>

                  <ImageUploaderModal
                    userId={user.id}
                    show={showImageUploaderModal}
                    handleClose={handleCloseImageUploaderModal}
                  />
                  <p>
                    <Link to={"#"} onClick={handleRemovePhoto}>
                      Удалить фотографию
                    </Link>
                  </p>

                  <p>
                    <Link to={"#"} onClick={handleShowChangePasswordModal}>
                      Сменить пароль
                    </Link>
                  </p>

                  <ChangePasswordModal
                    userId={user.id}
                    show={showChangePasswordModal}
                    handleClose={handleCloseChangePasswordModal}
                  />
                </div>
              )}
            </Card>

            {isCurrentUser && (
              <Card.Body>
                <div className="d-flex justify-content-center mb-4">
                  <div className="mx-2">
                    <Link
                      to={`/update-user/${user.id}/update`}
                      className="btn btn-warning btn-sm"
                      style={{ width: "120px" }}
                    >
                      Редактировать профиль
                    </Link>
                  </div>
                  <div className="mx-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleShowDeleteModal}
                      style={{ width: "120px" }}
                    >
                      Удалить профиль
                    </Button>
                  </div>
                </div>
              </Card.Body>
            )}
          </Col>

          <Col md={8}>
            <Card className="mb-3 shadow">
              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Имя: </h3>
                </Col>
                <Col md={5}>
                  <Card.Text>{user.firstName}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Фамилия:</h3>{" "}
                </Col>
                <Col md={5}>
                  <Card.Text>{user.lastName}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Пол:</h3>{" "}
                </Col>
                <Col md={5}>
                  <Card.Text>
                    {user.gender === "Male" ? "Мужской" : "Женский"}
                  </Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Электронная почта:</h3>{" "}
                </Col>
                <Col md={5}>
                  <Card.Text>{user.email}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Телефон: </h3>
                </Col>
                <Col md={5}>
                  <Card.Text>{user.phoneNumber}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Тип пользователя:</h3>{" "}
                </Col>
                <Col md={5}>
                  <Card.Text>
                    {userTypeLabels[user.userType] || "Неизвестный тип"}
                  </Card.Text>
                </Col>
              </Card.Body>

              {user.userType === "VET" && (
                <Card.Body className="d-flex align-items-center py-1">
                  <Col md={3}>
                    <h3>Специализация:</h3>{" "}
                  </Col>
                  <Col md={5}>
                    <Card.Text>{user.specialization}</Card.Text>
                  </Col>
                </Card.Body>
              )}

              {user.userType === "VET" && (
                <Card.Body className="d-flex align-items-center py-1">
                  <Col md={3}>
                    <h3>Адрес для приемов:</h3>{" "}
                  </Col>
                  <Col md={5}>
                    <Card.Text>{user.clinicAddress}</Card.Text>
                  </Col>
                </Card.Body>
              )}

              {user.userType === "VET" && (
                <Card.Body className="d-flex align-items-center py-1">
                  <Col md={3}>
                    <h3>Стоимость приема: </h3>
                  </Col>
                  <Col md={5}>
                    <Card.Text>{user.appointmentCost} руб.</Card.Text>
                  </Col>
                </Card.Body>
              )}

              <Card.Body className="d-flex align-items-center py-1">
                <Col md={3}>
                  <h3>Статус уч. записи:</h3>{" "}
                </Col>
                <Col md={5}>
                  <Card.Text
                    className={user.enabled ? style.active : style.inactive}
                  >
                    {user.enabled ? "Активный" : "Неактивный"}
                  </Card.Text>
                </Col>
              </Card.Body>
            </Card>

            {user.userType === "VET" && (
              <Card className="mb-3 shadow">
                <Card.Body className="d-flex align-items-center py-1">
                  <Row>
                    <p className="mb-3">
                      <h3>Краткая информация о вас:</h3>{" "}
                    </p>

                    <Card.Text>
                      {isLoading
                        ? "Загрузка..."
                        : biography ||
                          "На текущий момент информация не заполнена"}
                    </Card.Text>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
