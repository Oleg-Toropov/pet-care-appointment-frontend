import { useEffect, useState } from "react";
import { Accordion, Container, Row, Col } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import PetsTable from "../pet/PetsTable";
import { UserType } from "../utils/utilities";
import { formatAppointmentStatus, getStatusKey } from "../utils/utilities";
import useColorMapping from "../hooks/ColorMapping";
import PatientActions from "../actions/PatientActions";
import VeterinarianActions from "../actions/VeterinarianActions";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Link } from "react-router-dom";
import {
  updateAppointment,
  cancelAppointment,
  declineAppointment,
  approveAppointment,
  getAppointmentById,
} from "./AppointmentService";

import AlertMessage from "../common/AlertMessage";
import AppointmentFilter from "./AppointmentFilter";
import Paginator from "../common/Paginator";

const UserAppointments = ({ user, appointments: initialAppointments }) => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(4);

  const colors = useColorMapping();

  const [expandedAccordion, setExpandedAccordion] = useState(null);

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

  const fetchAppointment = async (appointmentId) => {
    const response = await getAppointmentById(appointmentId);

    const updatedAppointment = response.data;

    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? {
              ...appointment,
              ...updatedAppointment,
            }
          : appointment
      )
    );
  };

  const handlePetsUpdate = async (updatedAppointmentId) => {
    await fetchAppointment(updatedAppointmentId);
  };

  const handleDeclineAppointment = async (appointmentId) => {
    try {
      const response = await declineAppointment(appointmentId);
      const newStatus = response.data.status;
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const response = await approveAppointment(appointmentId);
      const newStatus = response.data.status;
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await cancelAppointment(appointmentId);
      const newStatus = response.data.status;
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      setExpandedAccordion(null);

      const result = await updateAppointment(
        updatedAppointment.id,
        updatedAppointment
      );

      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? updatedAppointment
          : appointment
      );

      const sortedAppointments = updatedAppointments.sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
      );

      setAppointments(sortedAppointments);

      const updatedIndex = sortedAppointments.findIndex(
        (appointment) => appointment.id === updatedAppointment.id
      );
      const newPage = Math.floor(updatedIndex / appointmentsPerPage) + 1;

      if (newPage !== currentPage) {
        setCurrentPage(newPage);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setExpandedAccordion(updatedAppointment.id);
      setSuccessMessage(result.data.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Ошибка обновления приема"
      );
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    if (expandedAccordion) {
      const accordionElement = document.getElementById(
        `accordion-${expandedAccordion}`
      );
      if (accordionElement) {
        accordionElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentPage]);

  const onSelectStatus = (status) => {
    setSelectedStatus(status);
    setResetPage(true);
  };

  const handleClearFilter = () => {
    setSelectedStatus("all");
  };

  const statuses = Array.from(
    new Set(appointments.map((appointment) => appointment.status))
  );

  const [resetPage, setResetPage] = useState(false);

  useEffect(() => {
    let filter = appointments;

    if (selectedStatus && selectedStatus !== "all") {
      filter = appointments.filter(
        (appointment) => appointment.status === selectedStatus
      );
    }

    filter.sort(
      (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );

    setFilteredAppointments(filter);

    if (resetPage) {
      setCurrentPage(1);
      setResetPage(false);
    }
  }, [selectedStatus, appointments, resetPage]);

  const indexOfLastVet = currentPage * appointmentsPerPage;
  const indexOfFirstVet = indexOfLastVet - appointmentsPerPage;

  const currentAppointments = filteredAppointments.slice(
    indexOfFirstVet,
    indexOfLastVet
  );

  const handleAccordionToggle = (appointmentId) => {
    setExpandedAccordion((prevId) =>
      prevId === appointmentId ? null : appointmentId
    );
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  return (
    <Container className="p-3">
      <AppointmentFilter
        onClearFilters={handleClearFilter}
        statuses={statuses}
        selectedStatus={selectedStatus}
        onSelectStatus={onSelectStatus}
      />

      <Accordion className="mt-4 mb-5">
        {currentAppointments.map((appointment) => {
          const isExpanded = expandedAccordion === appointment.id;

          const statusKey = getStatusKey(appointment.status);
          const statusColor = colors[statusKey] || colors["default"];
          const formattedStatus = formatAppointmentStatus(appointment.status);

          const isWaitingForApproval = statusKey === "waiting-for-approval";
          const isCancelled = statusKey === "cancelled";
          const isNotApproved = statusKey === "not-approved";
          const isCompleted = statusKey === "completed";
          const vet = appointment.veterinarian;
          return (
            <Accordion.Item
              eventKey={appointment.id}
              key={appointment.id}
              id={`accordion-${appointment.id}`}
              className="mb-4"
            >
              <Accordion.Header
                onClick={() => handleAccordionToggle(appointment.id)}
              >
                <div>
                  <div className="mb-3">
                    Дата приема:{" "}
                    {new Intl.DateTimeFormat("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(appointment.appointmentDate))}
                  </div>
                  <div style={{ color: statusColor }}>
                    Статус: {formattedStatus}
                  </div>
                </div>
              </Accordion.Header>
              {isExpanded && (
                <Accordion.Body>
                  <Row className="mb-4">
                    <Col md={4} className="mt-2">
                      <p>
                        Номер записи на прием :{" "}
                        <span className="text-info">
                          {appointment.appointmentNo}
                        </span>{" "}
                        <br />
                        Причина записи: <span>{appointment.reason}</span>
                        <br />
                        Время приема:
                        <span className="text-info">
                          {" "}
                          {new Intl.DateTimeFormat("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(
                            new Date(
                              `1970-01-01T${appointment.appointmentTime}`
                            )
                          )}
                        </span>{" "}
                      </p>
                      <ReactDatePicker
                        selected={
                          new Date(
                            `${appointment.appointmentDate}T${appointment.appointmentTime}`
                          )
                        }
                        locale="ru"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        inline
                      />
                    </Col>

                    <Col md={8} className="mt-2">
                      {user.userType === UserType.PATIENT && (
                        <>
                          <p>
                            Ветеринар: {appointment.veterinarian.firstName}{" "}
                            {appointment.veterinarian.lastName} (
                            {appointment.veterinarian.specialization}) <br />
                            Адрес проведения приема:{" "}
                            {appointment.veterinarian.clinicAddress}
                            <br />
                            Стоимость приема:{" "}
                            {appointment.veterinarian.appointmentCost} ₽
                          </p>
                        </>
                      )}
                      {user.userType === UserType.PATIENT &&
                        !(
                          isCancelled ||
                          isWaitingForApproval ||
                          isNotApproved
                        ) && (
                          <>
                            <p>
                              Электронная почта:{" "}
                              {appointment.veterinarian.email} <br />
                              Телефон:{" "}
                              <span className="text-info">
                                {appointment.veterinarian.phoneNumber}
                              </span>
                            </p>
                          </>
                        )}
                      {user.userType === UserType.VET &&
                        !(
                          isCancelled ||
                          isWaitingForApproval ||
                          isNotApproved
                        ) && (
                          <>
                            <p>
                              Клиент: {appointment.patient.firstName}{" "}
                              {appointment.patient.lastName} <br />
                              Электронная почта: {
                                appointment.patient.email
                              }{" "}
                              <br />
                              Телефон:{" "}
                              <span className="text-info">
                                {appointment.patient.phoneNumber}
                              </span>
                            </p>
                          </>
                        )}
                      <h4>Питомцы:</h4>
                      <PetsTable
                        pets={appointment.pets}
                        onPetsUpdate={handlePetsUpdate}
                        isEditable={isWaitingForApproval}
                        isPatient={user.userType === UserType.PATIENT}
                        appointmentId={appointment.id}
                      />
                    </Col>
                  </Row>

                  {showSuccessAlert && (
                    <AlertMessage type={"success"} message={successMessage} />
                  )}
                  {showErrorAlert && (
                    <AlertMessage type={"danger"} message={errorMessage} />
                  )}

                  {(user.userType === UserType.PATIENT ||
                    user.userType === UserType.ADMIN) &&
                    isCompleted && (
                      <Link
                        to={`/veterinarian/${vet.id}/veterinarian`}
                        state={{
                          specialization: vet.specialization,
                          firstName: vet.firstName,
                          lastName: vet.lastName,
                        }}
                        style={{ display: "block", marginBottom: "10px" }}
                      >
                        Написать отзыв о ветеринаре {vet.firstName}{" "}
                        {vet.lastName}
                      </Link>
                    )}

                  {(user.userType === UserType.PATIENT ||
                    user.userType === UserType.ADMIN) &&
                    isCompleted && (
                      <Link
                        to={`/book-appointment/${vet.id}/new-appointment`}
                        state={{
                          specialization: vet.specialization,
                          firstName: vet.firstName,
                          lastName: vet.lastName,
                        }}
                        style={{ display: "block", marginBottom: "10px" }}
                      >
                        Записаться на новый прием к ветеринару {vet.firstName}{" "}
                        {vet.lastName}
                      </Link>
                    )}

                  {(user.userType === UserType.PATIENT ||
                    user.userType === UserType.ADMIN) &&
                    (isCancelled || isNotApproved) && (
                      <Link to={`/doctors`} style={{ display: "block" }}>
                        Записаться на прием к другому ветеринару
                      </Link>
                    )}

                  {user &&
                    (user.userType === UserType.PATIENT ||
                      user.userType === UserType.ADMIN) && (
                      <div>
                        <PatientActions
                          onCancel={handleCancelAppointment}
                          onUpdate={handleUpdateAppointment}
                          isDisabled={!isWaitingForApproval}
                          appointment={appointment}
                        />
                      </div>
                    )}

                  {user && user.userType === UserType.VET && (
                    <div>
                      <VeterinarianActions
                        onApprove={handleApproveAppointment}
                        onDecline={handleDeclineAppointment}
                        isDisabled={!isWaitingForApproval}
                        appointment={appointment}
                      />
                    </div>
                  )}
                </Accordion.Body>
              )}
            </Accordion.Item>
          );
        })}
      </Accordion>

      <Paginator
        itemsPerPage={appointmentsPerPage}
        totalItems={filteredAppointments.length}
        paginate={setCurrentPage}
        currentPage={currentPage}
      />
    </Container>
  );
};

export default UserAppointments;
