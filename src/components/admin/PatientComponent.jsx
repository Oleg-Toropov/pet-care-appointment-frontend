import { useState, useEffect } from "react";
import {
  Table,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsEyeFill,
  BsLockFill,
  BsPencilFill,
  BsTrashFill,
  BsUnlockFill,
} from "react-icons/bs";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getPatients } from "../patient/PatientService";
import Paginator from "../common/Paginator";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import PatientEditableRows from "../patient/PatientEditableRows";
import { deleteUser, updateUser } from "../user/UserService";
import { lockUserAccount, unLockUserAccount } from "../user/UserService";

const PatientComponent = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [editPatientId, setEditPatientId] = useState(null);

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

  const fetchPatients = () => {
    getPatients()
      .then((data) => {
        setPatients(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeleteAccount = async () => {
    if (patientToDelete) {
      try {
        const response = await deleteUser(patientToDelete);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
        fetchPatients();
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };

  const handleShowDeleteModal = (patientId) => {
    setPatientToDelete(patientId);
    setShowDeleteModal(true);
  };

  const handleToggleAccountLock = async (patient) => {
    try {
      let response;
      if (patient.enabled) {
        response = await lockUserAccount(patient.id);
      } else {
        response = await unLockUserAccount(patient.id);
      }

      setPatients(
        patients.map((thePatient) =>
          thePatient.id === patient.id
            ? { ...thePatient, enabled: !thePatient.enabled }
            : thePatient
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
    setEditPatientId(null);
  };

  const handleEditClick = (vetId) => {
    setEditPatientId(vetId);
  };

  const handleSaveUpdate = async (patientId, editedPatient) => {
    try {
      const response = await updateUser(editedPatient, patientId);

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === patientId ? { ...patient, ...editedPatient } : patient
        )
      );

      setEditPatientId(null);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    let filtered = patients;
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
          patient.lastName.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, patients]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <main>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemToDelete="аккаунт клиента"
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

      <Row className="mb-2">
        <h5 className="mb-4">Список клиентов</h5>
        <Col md={5}>
          <FormControl
            id="patient-search"
            name="patientSearch"
            type="text"
            placeholder="Поиск по имени или фамилии"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <button onClick={handleClearSearch} className="btn btn-secondary">
            Очистить
          </button>
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
            <th>Дата регистрации</th>
            <th colSpan={4}>Действия</th>
          </tr>
        </thead>

        <tbody>
          {currentPatients.map((patient, index) =>
            editPatientId === patient.id ? (
              <PatientEditableRows
                key={patient.id}
                patient={patient}
                onSave={handleSaveUpdate}
                onCancel={handleCancelClick}
              />
            ) : (
              <tr key={index}>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>{patient.email}</td>
                <td>{patient.phoneNumber}</td>
                <td> {patient.gender === "Male" ? "Мужской" : "Женский"}</td>
                <td>
                  {new Date(patient.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Посмотреть информацию о клиенте
                      </Tooltip>
                    }
                  >
                    <Link
                      to={`/user-dashboard/${patient.id}/my-dashboard`}
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
                        Редактировать информацию о клиенте
                      </Tooltip>
                    }
                  >
                    <Link to={"#"} className="text-warning">
                      <BsPencilFill
                        onClick={() => handleEditClick(patient.id)}
                      />
                    </Link>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        {patient.enabled ? "Заблокировать" : "Разблокировать"}{" "}
                        аккаунт клиента
                      </Tooltip>
                    }
                  >
                    <span
                      onClick={() => handleToggleAccountLock(patient)}
                      style={{ cursor: "pointer" }}
                    >
                      {patient.enabled ? <BsUnlockFill /> : <BsLockFill />}
                    </span>
                  </OverlayTrigger>
                </td>

                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Удалить аккаунт клиента
                      </Tooltip>
                    }
                  >
                    <Link
                      to={"#"}
                      className="text-danger"
                      onClick={() => handleShowDeleteModal(patient.id)}
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
        currentPage={currentPage}
        totalItems={filteredPatients.length}
        paginate={setCurrentPage}
        itemsPerPage={patientsPerPage}
      />
    </main>
  );
};

export default PatientComponent;
