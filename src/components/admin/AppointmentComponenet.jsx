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
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

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

  const fetchAppointments = (page = 0, search = "") => {
    getAppointments(page, appointmentsPerPage, search)
      .then((data) => {
        const { content, totalPages } = data.data;
        setAppointments(content);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        setErrorMessage(error.message || "Ошибка загрузки данных");
        setShowErrorAlert(true);
      });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchAppointments(currentPage - 1, searchTerm);
  }, [currentPage, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
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
        fetchAppointments(currentPage - 1, searchTerm);
        setShowSuccessAlert(true);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Ошибка при удалении записи"
        );
        setShowErrorAlert(true);
      }
    }
  };

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
            placeholder="Поиск email или номеру приема"
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
            <th>Статус</th>
            <th>Email клиента</th>
            <th>Email ветеринара</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
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
                <td>{formatAppointmentStatus(appointment.status)}</td>
                <td>{appointment.patient?.email}</td>
                <td>{appointment.veterinarian?.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                <NoDataAvailable
                  dataType="appointment data"
                  message={errorMessage}
                />
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Paginator
        currentPage={currentPage}
        totalItems={totalPages * appointmentsPerPage}
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
