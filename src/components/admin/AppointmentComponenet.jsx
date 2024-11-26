import { useState, useEffect } from "react";
import { Table, Row, Col, FormControl, Modal, Button } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import {
  getAppointments,
  deleteAppointment,
} from "../appointment/AppointmentService";
import Paginator from "../common/Paginator";
import { formatAppointmentStatus } from "../utils/utilities";
import NoDataAvailable from "../common/NoDataAvailable";

const AppointmentComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    showSuccessAlert,
    showErrorAlert,
    setErrorMessage,
    setShowErrorAlert,
    setShowSuccessAlert,
  } = UseMessageAlerts();

  const fetchAppointments = (page = 0) => {
    getAppointments(page, appointmentsPerPage)
      .then((data) => {
        const { content } = data.data;
        setAppointments(content);
        setFilteredAppointments(content);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      });
  };

  useEffect(() => {
    fetchAppointments(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          appointment.reason.toLowerCase().includes(lowercasedSearchTerm) ||
          appointment.status.toLowerCase().includes(lowercasedSearchTerm) ||
          appointment.appointmentNo
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.patient?.firstName
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.patient?.lastName
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.patient?.email
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.patient?.phoneNumber
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.veterinarian?.firstName
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.veterinarian?.lastName
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.veterinarian?.email
            .toLowerCase()
            .includes(lowercasedSearchTerm) ||
          appointment.veterinarian?.phoneNumber
            .toLowerCase()
            .includes(lowercasedSearchTerm)
      );
    }
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [searchTerm, appointments]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredAppointments(appointments);
    setCurrentPage(1);
  };

  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (selectedAppointment) {
      try {
        const response = await deleteAppointment(selectedAppointment.id);
        setSuccessMessage(response.message);
        setShowModal(false);
        fetchAppointments(currentPage - 1);
        setShowSuccessAlert(true);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      }
    }
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  return (
    <main>
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
        <h5 className="mb-4">Список записей на прием</h5>
        <Col md={5}>
          <FormControl
            id="appointment-search"
            name="appointmentSearch"
            type="text"
            placeholder="Поиск по имени, фамилии, email, телефону, номеру приема"
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
            <th>Номер приема</th>
            <th>Дата</th>
            <th>Время</th>
            {/* <th>Причина записи</th> */}
            <th>Статус</th>
            <th>Email клиента</th>
            <th>Email ветеринара</th>
          </tr>
        </thead>
        <tbody>
          {/* {currentAppointments.map > 0 ? (
            (appointment) => (
              <tr
                key={appointment.id}
                onClick={() => handleRowClick(appointment)}
                style={{ cursor: "pointer" }}
              >
                <td>{appointment.appointmentNo}</td>
                <td>
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "ru-RU"
                  )}
                </td>
                <td>{appointment.appointmentTime}</td>
                <td>{appointment.reason}</td>
                <td>{formatAppointmentStatus(appointment.status)}</td>
                <td>{appointment.patient?.email}</td>
                <td>{appointment.veterinarian?.email}</td>
              </tr>
            )
          ) : (
            <NoDataAvailable
              dataType={"appointment data"}
              message={errorMessage}
            />
          )} */}

          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                onClick={() => handleRowClick(appointment)}
                style={{ cursor: "pointer" }}
              >
                <td>{appointment.appointmentNo}</td>
                <td>
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "ru-RU"
                  )}
                </td>
                <td>{appointment.appointmentTime}</td>
                {/* <td>{appointment.reason}</td> */}
                <td>{formatAppointmentStatus(appointment.status)}</td>
                <td>{appointment.patient?.email}</td>
                <td>{appointment.veterinarian?.email}</td>
              </tr>
            ))
          ) : (
            <></>
          )}

          {currentAppointments.length === 0 && (
            <tr>
              <td colSpan="7">
                <NoDataAvailable
                  dataType={"appointment data"}
                  message={errorMessage}
                />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalItems={filteredAppointments.length}
        paginate={(page) => setCurrentPage(page)}
        itemsPerPage={appointmentsPerPage}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Детали приёма</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <p>
                <strong>Дата записи на прием:</strong>{" "}
                {new Date(selectedAppointment.createdAt).toLocaleDateString(
                  "ru-RU"
                )}
              </p>

              <p>
                <strong>Причина приема:</strong> {selectedAppointment.reason}
              </p>

              <hr />
              <h6>Питомцы:</h6>
              {selectedAppointment.pets.map((pet) => (
                <div key={pet.id}>
                  <p>
                    <strong>Кличка:</strong> {pet.name}, <strong>Тип:</strong>{" "}
                    {pet.type}, <strong>Цвет:</strong> {pet.color},{" "}
                    <strong>Порода:</strong> {pet.breed},{" "}
                    <strong>Возраст:</strong> {pet.age}
                  </p>
                </div>
              ))}
              <hr />

              <h6>Информация о клиенте:</h6>
              <p>
                <strong>Имя:</strong> {selectedAppointment.patient?.firstName}
              </p>
              <p>
                <strong>Фамилия:</strong>{" "}
                {selectedAppointment.patient?.lastName}
              </p>
              <p>
                <strong>Пол:</strong>{" "}
                {selectedAppointment.patient?.gender === "Male"
                  ? "Мужской"
                  : "Женский"}
              </p>
              <p>
                <strong>Телефон:</strong>{" "}
                {selectedAppointment.patient?.phoneNumber}
              </p>

              <hr />
              <h6>Информация о ветеринаре:</h6>
              <p>
                <strong>Имя:</strong>{" "}
                {selectedAppointment.veterinarian?.firstName}
              </p>
              <p>
                <strong>Фамилия:</strong>{" "}
                {selectedAppointment.veterinarian?.lastName}
              </p>
              <p>
                <strong>Пол:</strong>{" "}
                {selectedAppointment.veterinarian?.gender === "Male"
                  ? "Мужской"
                  : "Женский"}
              </p>
              <p>
                <strong>Телефон:</strong>{" "}
                {selectedAppointment.veterinarian?.phoneNumber}
              </p>

              <p>
                <strong>Специализация:</strong>{" "}
                {selectedAppointment.veterinarian?.specialization}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Удалить прием
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default AppointmentComponent;
