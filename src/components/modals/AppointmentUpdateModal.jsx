import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";

const AppointmentUpdateModal = ({
  show,
  handleClose,
  appointment,
  handleUpdate,
}) => {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(appointment.appointmentDate)
  );
  const [appointmentTime, setAppointmentTime] = useState(
    new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)
  );
  const [reason, setReason] = useState(appointment.reason);

  const handleSubmit = () => {
    const updatedAppointment = {
      ...appointment,
      appointmentDate: appointmentDate.toISOString().split("T")[0],
      appointmentTime: appointmentTime
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5),
      reason,
    };
    handleUpdate(updatedAppointment);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Изменение записи на прием</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="appointmentDate">
            <Form.Label className=" me-2">Дата</Form.Label>
            <DatePicker
              selected={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
              dateFormat="dd.MM.yyyy"
              className="form-control shadow"
              minDate={new Date()}
              locale="ru"
              placeholderText="Выберите дату"
              required
            />
          </Form.Group>

          <Form.Group controlId="appointmentTime" className="mt-4">
            <Form.Label className=" me-2">Время</Form.Label>
            <DatePicker
              selected={appointmentTime}
              onChange={(time) => setAppointmentTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="HH:mm"
              className="form-control shadow"
              locale="ru"
              placeholderText="Выберите время"
              required
            />
          </Form.Group>

          <Form.Group controlId="reason" className="mt-2 shadow">
            <Form.Label>Причина записи</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={3}
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отменить
        </Button>
        <Button variant="info" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentUpdateModal;
