import React, { useState } from "react";
import UserImage from "../common/UserImage";
import { Link } from "react-router-dom";
import ImageUploaderModal from "../modals/ImageUploaderModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import { Col, Row, Card, ListGroup, Button, Container } from "react-bootstrap";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import style from "../../components/user/UserProfile.module.css";

const UserProfile = ({ user, handleRemovePhoto, handleDeleteAccount }) => {
  const [showImageUploaderModal, setShowImageUploaderModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // const navigate = useNavigate();

  const handleShowImageUploaderModal = () => {
    setShowImageUploaderModal(true);
  };
  const handleCloseImageUploaderModal = () => {
    setShowImageUploaderModal(false);
  };

  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

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
                <UserImage userId={user.id} userPhoto={user.photo} />
              </Card.Body>
              <div className="text-center">
                <p>
                  {" "}
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
                  {" "}
                  <Link to={"#"} onClick={handleRemovePhoto}>
                    Удалить фотографию
                  </Link>
                </p>

                <p>
                  {" "}
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
            </Card>
          </Col>

          <Col md={8}>
            <Card className="mb-3 shadow">
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Имя :</Col>
                <Col md={4}>
                  <Card.Text>{user.firstName}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Фамилия :</Col>
                <Col md={4}>
                  <Card.Text>{user.lastName}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Пол :</Col>
                <Col md={4}>
                  <Card.Text>
                    {user.gender === "Male" ? "Мужской" : "Женский"}
                  </Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Электронная почта :</Col>
                <Col md={4}>
                  <Card.Text>{user.email}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Телефон :</Col>
                <Col md={4}>
                  <Card.Text>{user.phoneNumber}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Тип пользователя :</Col>
                <Col md={4}>
                  <Card.Text>
                    {user.userType === "VET" ? "Ветеринар" : "Пациент"}
                  </Card.Text>
                </Col>
              </Card.Body>

              {user.userType === "VET" && (
                <Card.Body className="d-flex align-items-center">
                  <Col md={4}>Специализация : </Col>
                  <Col md={4}>
                    <Card.Text>{user.specialization}</Card.Text>
                  </Col>
                </Card.Body>
              )}

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Статус учетной записи : </Col>
                <Col md={4}>
                  <Card.Text
                    className={user.enabled ? style.active : style.inactive}
                  >
                    {user.enabled ? "Активный" : "Неактивный"}
                  </Card.Text>
                </Col>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow">
              <Card.Body className="d-flex align-items-center">
                <Col md={2}>Полномочия :</Col>
                <Col md={4}>
                  <ListGroup variant="flush">
                    {user.roles &&
                      user.roles.map((role, index) => (
                        <ListGroup.Item key={index} className="text-success">
                          {role ? role.replace("ROLE_", "") : ""}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Col>
              </Card.Body>
            </Card>

            <Card.Body>
              <div className="d-flex justify-content-center mb-4">
                <div className="mx-2">
                  <Link
                    to={`/update-user/${user.id}/update`}
                    className="btn btn-warning btn-sm"
                  >
                    Редактировать профиль
                  </Link>
                </div>
                <div className="mx-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleShowDeleteModal}
                  >
                    Удалить профиль
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;