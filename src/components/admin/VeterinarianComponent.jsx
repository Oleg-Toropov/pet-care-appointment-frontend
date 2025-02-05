import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BsEyeFill,
  BsLockFill,
  BsPencilFill,
  BsPlusSquareFill,
  BsTrashFill,
  BsUnlockFill,
} from "react-icons/bs";
import { Table, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { getVeterinarians } from "../veterinarian/VeterinarianService";
import { deleteUser, updateUser } from "../user/UserService";
import { lockUserAccount, unLockUserAccount } from "../user/UserService";
import VetEditableRows from "../veterinarian/VetEditableRows";
import UserFilter from "../user/UserFilter";
import Paginator from "../common/Paginator";

const VeterinarianComponent = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vetToDelete, setVetToDelete] = useState(null);
  const [editVetId, setEditVetId] = useState(null);
  const [filteredVets, setFilteredVets] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [vetsPerPage] = useState(10);

  const indexOfLastVet = currentPage * vetsPerPage;
  const indexOfFirstVet = indexOfLastVet - vetsPerPage;
  const currentVets = filteredVets.slice(indexOfFirstVet, indexOfLastVet);

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

  const fetchVeterinarians = () => {
    getVeterinarians()
      .then((data) => {
        setVeterinarians(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      });
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const handleDeleteAccount = async () => {
    if (vetToDelete) {
      try {
        const response = await deleteUser(vetToDelete);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
        fetchVeterinarians();
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };
  const handleShowDeleteModal = (vetId) => {
    setVetToDelete(vetId);
    setShowDeleteModal(true);
  };

  const handleToggleAccountLock = async (vet) => {
    try {
      let response;
      if (vet.enabled) {
        response = await lockUserAccount(vet.id);
      } else {
        response = await unLockUserAccount(vet.id);
      }

      setVeterinarians(
        veterinarians.map((theVet) =>
          theVet.id === vet.id
            ? { ...theVet, enabled: !theVet.enabled }
            : theVet
        )
      );
      setSuccessMessage(response.message);
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    }
  };

  const handleCancelClick = () => {
    setEditVetId(null);
  };

  const handleEditClick = (vetId) => {
    setEditVetId(vetId);
  };

  const handleSaveUpdate = async (vetId, editedVet) => {
    try {
      const response = await updateUser(editedVet, vetId);

      setVeterinarians((prevVets) =>
        prevVets.map((vet) =>
          vet.id === vetId ? { ...vet, ...editedVet } : vet
        )
      );

      setEditVetId(null);

      setShowErrorAlert(false);
      setErrorMessage("");

      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setShowSuccessAlert(false);
      setSuccessMessage("");

      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    let filtered = veterinarians;
    if (selectedSpecialization) {
      filtered = filtered.filter(
        (vet) => vet.specialization === selectedSpecialization
      );
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredVets(filtered);
  }, [veterinarians, selectedSpecialization]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecialization]);

  const specializations = Array.from(
    new Set(veterinarians.map((vet) => vet.specialization))
  );

  const handleClearFilters = () => {
    setSelectedSpecialization("");
  };

  return (
    <main className="mt-2">
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemToDelete="аккаунт ветеринара"
      />

      <Row>
        <Col>
          {showErrorAlert && (
            <AlertMessage type="danger" message={errorMessage} />
          )}
          {showSuccessAlert && (
            <AlertMessage type="success" message={successMessage} />
          )}
        </Col>
      </Row>

      <Row className="mb=4">
        <h5 className="mb-4">Список ветеринаров</h5>
        <Col md={6}>
          {" "}
          <UserFilter
            values={specializations}
            selectedValue={selectedSpecialization}
            onSelectedValue={setSelectedSpecialization}
            onClearFilters={handleClearFilters}
            label={"Фильтр: "}
            additionalText="Выберите специализацию"
          />
        </Col>
        <Col>
          {" "}
          <div className="d-flex justify-content-end">
            <Link to={"/register-user"}>
              {" "}
              <BsPlusSquareFill /> добавить нового пользователя
            </Link>
          </div>
        </Col>
      </Row>

      <Table bordered hover striped>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Электронная почта</th>
            <th>Телефон</th>
            <th>Пол</th>
            <th>Специализация</th>
            <th>Дата регистрации</th>
            <th colSpan={4}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {currentVets.map((vet, index) =>
            editVetId === vet.id ? (
              <VetEditableRows
                key={vet.id}
                vet={vet}
                onSave={handleSaveUpdate}
                onCancel={handleCancelClick}
              />
            ) : (
              <tr key={vet.id}>
                <td>{vet.firstName}</td>
                <td>{vet.lastName}</td>
                <td>{vet.email}</td>
                <td>{vet.phoneNumber}</td>
                <td> {vet.gender === "Male" ? "Мужской" : "Женский"}</td>
                <td>{vet.specialization}</td>
                <td>{new Date(vet.createdAt).toLocaleDateString("ru-RU")}</td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Посмотреть информацию о ветеринаре
                      </Tooltip>
                    }
                  >
                    <Link
                      to={`/user-dashboard/${vet.id}/my-dashboard`}
                      className="text-info"
                    >
                      <BsEyeFill />
                    </Link>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Редактировать информацию о ветеринаре
                      </Tooltip>
                    }
                  >
                    <Link to={"#"} className="text-warning">
                      <BsPencilFill onClick={() => handleEditClick(vet.id)} />
                    </Link>
                  </OverlayTrigger>
                </td>

                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        {vet.enabled ? "Заблокировать" : "Разблокировать"}{" "}
                        аккаунт ветеринара
                      </Tooltip>
                    }
                  >
                    <span
                      onClick={() => handleToggleAccountLock(vet)}
                      style={{ cursor: "pointer" }}
                    >
                      {vet.enabled ? <BsUnlockFill /> : <BsLockFill />}
                    </span>
                  </OverlayTrigger>
                </td>

                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Удалить аккаунт ветеринара
                      </Tooltip>
                    }
                  >
                    <Link
                      to={"#"}
                      className="text-danger"
                      onClick={() => handleShowDeleteModal(vet.id)}
                    >
                      <BsTrashFill />
                    </Link>
                  </OverlayTrigger>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      <Paginator
        paginate={setCurrentPage}
        currentPage={currentPage}
        itemsPerPage={vetsPerPage}
        totalItems={filteredVets.length}
      />
    </main>
  );
};

export default VeterinarianComponent;
