import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ru } from "date-fns/locale";
import { getAvailableTimesForAppointment } from "../veterinarian/VeterinarianService";

const AppointmentUpdateModal = ({
  show,
  handleClose,
  appointment,
  handleUpdate,
}) => {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(appointment.appointmentDate)
  );
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(
    appointment.appointmentTime.slice(0, 5)
  );
  const [reason, setReason] = useState(appointment.reason);

  const handleDateSelect = async (date) => {
    if (!date) return;
    setAppointmentDate(date);

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    try {
      const response = await getAvailableTimesForAppointment(
        appointment.veterinarian.id,
        formattedDate
      );
      let times = response.data.map((time) => time.slice(0, 5));

      if (date.toDateString() === new Date().toDateString()) {
        const currentHour = new Date().getHours();
        const currentMinutes = new Date().getMinutes();
        times = times.filter((time) => {
          const [hour, minutes] = time.split(":").map(Number);
          return (
            hour > currentHour ||
            (hour === currentHour && minutes > currentMinutes)
          );
        });
      }

      setAvailableTimes(times);
    } catch (error) {
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = () => {
    const updatedAppointment = {
      ...appointment,
      appointmentDate: `${appointmentDate.getFullYear()}-${String(
        appointmentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(appointmentDate.getDate()).padStart(
        2,
        "0"
      )}`,
      appointmentTime: selectedTime,
      reason,
    };
    handleUpdate(updatedAppointment);
  };

  useEffect(() => {
    handleDateSelect(new Date(appointment.appointmentDate));
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Изменение записи на прием</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-4">
            <Col md={9}>
              <div className="calendar-container">
                <div className="calendar">
                  <h5 className="legend">Дата:</h5>
                  <DayPicker
                    mode="single"
                    selected={appointmentDate}
                    onSelect={handleDateSelect}
                    locale={ru}
                    disabled={{
                      before: new Date(),
                      after: new Date(
                        new Date().setDate(new Date().getDate() + 30)
                      ),
                    }}
                    className="custom-calendar"
                    modifiersClassNames={{
                      selected: "rdp-day_selected",
                    }}
                  />
                </div>

                {availableTimes.length > 0 ? (
                  <div className="time-container">
                    <h5 className="legend">Доступное время:</h5>
                    <div className="time-grid">
                      {availableTimes.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`time-button ${
                            time === selectedTime ? "selected" : ""
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-times-message">
                    На выбранную дату нет доступного времени. Пожалуйста,
                    выберите другую дату.
                  </p>
                )}
              </div>
            </Col>
          </Form.Group>

          <Form.Group controlId="reason" className="mt-4">
            <Form.Label className="legend">Причина записи:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Введите причину"
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
