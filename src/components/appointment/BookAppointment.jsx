import { useState, useEffect } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  OverlayTrigger,
  Button,
  Tooltip,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ru } from "date-fns/locale";

import PetEntry from "../pet/PetEntry";
import { bookAppointment } from "./AppointmentService";
import {
  getAvailableTimesForAppointment,
  getVeterinarianById,
} from "../veterinarian/VeterinarianService";
import ProcessSpinner from "../common/ProcessSpinner";

const BookAppointment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: null,
    appointmentTime: null,
    reason: "",
    pets: [
      {
        petName: "",
        petType: "",
        petColor: "",
        petBreed: "",
        petAge: "",
      },
    ],
  });

  const [isDateSelected, setIsDateSelected] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const { recipientId } = useParams();
  const location = useLocation();

  const initialData = location.state || {};
  const [vetData, setVetData] = useState(initialData);
  const [loading, setLoading] = useState(
    !initialData.firstName ||
      !initialData.lastName ||
      !initialData.specialization
  );

  useEffect(() => {
    if (!recipientId) return;

    getVeterinarianById(recipientId)
      .then((response) => {
        if (response && response.data) {
          setVetData(response.data);
        }
      })
      .finally(() => setLoading(false));
  }, [recipientId]);

  const {
    successMessage,
    setSuccessMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    errorMessage,
    setErrorMessage,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const senderId = localStorage.getItem("userId");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePetChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      pets: prevState.pets.map((pet, ind) =>
        ind === index ? { ...pet, [name]: value } : pet
      ),
    }));
  };

  const addPet = () => {
    const newPet = {
      petName: "",
      petType: "",
      petColor: "",
      petBreed: "",
      petAge: "",
    };
    setFormData((prevState) => ({
      ...prevState,
      pets: [...prevState.pets, newPet],
    }));
  };

  const removePet = (index) => {
    const updatedPets = formData.pets.filter((_, idx) => idx !== index);
    setFormData((prevState) => ({
      ...prevState,
      pets: updatedPets,
    }));
  };

  const handleDateSelect = async (date) => {
    if (!date) return;
    setIsDateSelected(true);

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setFormData((prevState) => ({
      ...prevState,
      appointmentDate: formattedDate,
    }));

    try {
      const response = await getAvailableTimesForAppointment(
        recipientId,
        formattedDate
      );
      let times = response.data;

      times = times.map((time) => time.slice(0, 5));

      const now = new Date();

      if (date.toDateString() === now.toDateString()) {
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

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
      setErrorMessage("Не удалось загрузить доступное время");
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData((prevState) => ({
      ...prevState,
      appointmentTime: time,
    }));
    setSelectedTime(time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.appointmentDate || !formData.appointmentTime) {
      setErrorMessage("Пожалуйста, выберите дату и время.");
      setShowErrorAlert(true);
      return;
    }

    const request = {
      appointment: {
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
      },
      pets: formData.pets.map((pet) => ({
        name: pet.petName,
        type: pet.petType,
        color: pet.petColor,
        breed: pet.petBreed,
        age: pet.petAge,
      })),
    };

    setIsProcessing(true);
    try {
      const response = await bookAppointment(senderId, recipientId, request);
      setSuccessMessage(response.message);
      handleReset();
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Произошла ошибка. Попробуйте снова."
      );
      setShowErrorAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setIsDateSelected(false);
    setFormData({
      appointmentDate: null,
      appointmentTime: null,
      reason: "",
      pets: [
        {
          petName: "",
          petType: "",
          petColor: "",
          petBreed: "",
          petAge: "",
        },
      ],
    });
    setAvailableTimes([]);
    setSelectedTime("");
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={10}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header as="h5" className="mb-4 text-center">
                Запись на прием к ветеринару:
                <Link to={`/Veterinarian/${recipientId}/veterinarian`}>
                  <p className="mt-2">
                    {vetData?.firstName} {vetData?.lastName} (
                    {vetData?.specialization?.toLowerCase()})
                  </p>
                </Link>{" "}
              </Card.Header>
              <Card.Body>
                <Form.Group as={Row} className="mb-4">
                  <Col md={8}>
                    <div className="calendar-container">
                      <div className="calendar">
                        <h5 className="legend">Выберите дату:</h5>
                        <DayPicker
                          mode="single"
                          selected={formData.appointmentDate}
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
                        isDateSelected &&
                        !isProcessing && (
                          <p className="no-times-message">
                            На выбранную дату нет доступного времени.
                            Пожалуйста, выберите другую дату.
                          </p>
                        )
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label htmlFor="reason" className="legend">
                    Причина записи на прием
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="reason"
                    name="reason"
                    className="shadow"
                    onChange={handleInputChange}
                    value={formData.reason}
                    required
                  />
                </Form.Group>

                {formData.pets.map((pet, index) => (
                  <PetEntry
                    key={index}
                    pet={pet}
                    index={index}
                    handleInputChange={(e) => handlePetChange(index, e)}
                    removePet={() => removePet(index)}
                    canRemove={formData.pets.length > 1}
                  />
                ))}

                {showErrorAlert && (
                  <AlertMessage type={"danger"} message={errorMessage} />
                )}
                {showSuccessAlert && (
                  <AlertMessage type={"success"} message={successMessage} />
                )}

                <div className="d-flex justify-content-center mb-3">
                  <OverlayTrigger overlay={<Tooltip>Добавить питомца</Tooltip>}>
                    <Button
                      onClick={addPet}
                      className="me-2 custom-button-light"
                    >
                      <FaPlus />
                    </Button>
                  </OverlayTrigger>

                  <Button
                    type="submit"
                    className="me-2 custom-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Регистрация записи на прием..." />
                    ) : (
                      "Записаться"
                    )}
                  </Button>

                  <Button className="custom-button-light" onClick={handleReset}>
                    Очистить
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;
