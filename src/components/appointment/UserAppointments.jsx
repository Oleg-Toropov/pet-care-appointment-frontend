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
import { Link, useParams } from "react-router-dom";
import {
  updateAppointment,
  cancelAppointment,
  declineAppointment,
  approveAppointment,
  getAppointmentById,
} from "./AppointmentService";

import AlertMessage from "../common/AlertMessage";
import UserInformation from "../common/UserInformation";
import AppointmentFilter from "./AppointmentFilter";
import Paginator from "../common/Paginator";

const UserAppointments = ({ user, appointments: initialAppointments }) => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(4);

  const colors = useColorMapping();

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
    console.log(response);

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
    const result = await updateAppointment(
      updatedAppointment.id,
      updatedAppointment
    );
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? updatedAppointment
          : appointment
      )
    );
    setSuccessMessage(result.data.message);
    setShowSuccessAlert(true);
  };

  const onSelectStatus = (status) => {
    setSelectedStatus(status);
  };
  const handleClearFilter = () => {
    setSelectedStatus("all");
  };

  const statuses = Array.from(
    new Set(appointments.map((appointment) => appointment.status))
  );

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

    setCurrentPage(1);
  }, [selectedStatus, appointments]);

  const indexOfLastVet = currentPage * appointmentsPerPage;
  const indexOfFirstVet = indexOfLastVet - appointmentsPerPage;

  const currentAppointments = filteredAppointments.slice(
    indexOfFirstVet,
    indexOfLastVet
  );

  return (
    <Container className="p-3">
      <AppointmentFilter
        onClearFilters={handleClearFilter}
        statuses={statuses}
        selectedStatus={selectedStatus}
        onSelectStatus={onSelectStatus}
      />

      <Accordion className="mt-4 mb-5">
        {currentAppointments.map((appointment, index) => {
          const statusKey = getStatusKey(appointment.status);
          const statusColor = colors[statusKey] || colors["default"];
          const formattedStatus = formatAppointmentStatus(appointment.status);

          const isWaitingForApproval = statusKey === "waiting-for-approval";
          const isCancelled = statusKey === "cancelled";
          const recipientId = appointment.veterinarian.id;

          return (
            <Accordion.Item eventKey={index} key={index} className="mb-4">
              <Accordion.Header>
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
              <Accordion.Body>
                <Row className="mb-4">
                  <Col md={4} className="m-t2">
                    <p>
                      Номер записи на прием :{" "}
                      <span className="text-info">
                        {appointment.appointmentNo}
                      </span>
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

                    <p>
                      Время приема:
                      <span className="text-info">
                        {" "}
                        {new Intl.DateTimeFormat("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(
                          new Date(`1970-01-01T${appointment.appointmentTime}`)
                        )}
                      </span>{" "}
                    </p>

                    <p>
                      Причина записи: <span>{appointment.reason}</span>
                    </p>
                  </Col>

                  <Col md={8} className="mt-2">
                    <h4>Питомцы:</h4>
                    <PetsTable
                      pets={appointment.pets}
                      onPetsUpdate={handlePetsUpdate}
                      isEditable={isWaitingForApproval}
                      isPatient={user.userType === UserType.PATIENT}
                      appointmentId={appointment.id}
                    />
                  </Col>

                  {!(isCancelled || isWaitingForApproval) && (
                    <UserInformation
                      userType={user.userType}
                      appointment={appointment}
                    />
                  )}
                </Row>

                {showSuccessAlert && (
                  <AlertMessage type={"success"} message={successMessage} />
                )}
                {showErrorAlert && (
                  <AlertMessage type={"danger"} message={errorMessage} />
                )}

                {user.userType === UserType.PATIENT && (
                  <Link to={`/book-appointment/${recipientId}/new-appointment`}>
                    Записаться на новый прием
                  </Link>
                )}

                {user && user.userType === UserType.PATIENT && (
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
