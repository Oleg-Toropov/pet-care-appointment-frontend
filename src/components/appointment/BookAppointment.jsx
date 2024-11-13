import { useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import { useParams } from "react-router-dom";
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
import DatePicker from "react-datepicker";
import PetEntry from "../pet/PetEntry";
import { bookAppointment } from "./AppointmentService";
import ProcessSpinner from "../common/ProcessSpinner";

const BookAppointment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
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

  const { recipientId } = useParams();
  const senderId = localStorage.getItem("userId");

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      appointmentDate: date,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevState) => ({
      ...prevState,
      appointmentTime: time,
    }));
  };

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

  const removePet = (index, e) => {
    const filterPets = formData.pets.filter((_, idx) => idx !== index);
    setFormData((prevState) => ({
      ...prevState,
      pets: filterPets,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = formData.appointmentDate
      ? formData.appointmentDate.toISOString().split("T")[0]
      : "";

    const formattedTime = formData.appointmentTime
      ? formData.appointmentTime.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "";

    const pets = formData.pets.map((pet) => ({
      name: pet.petName,
      type: pet.petType,
      color: pet.petColor,
      breed: pet.petBreed,
      age: pet.petAge,
    }));

    const request = {
      appointment: {
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        reason: formData.reason,
      },
      pets: pets,
    };

    setIsProcessing(true);
    try {
      const response = await bookAppointment(senderId, recipientId, request);
      setSuccessMessage(response.message);
      handleReset();
      setShowSuccessAlert(true);
    } catch (error) {
      if (error.response.data.status === 401) {
        setErrorMessage(
          "Пожалуйста, войдите в систему, чтобы записаться на прием"
        );
        setShowErrorAlert(true);
      } else {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFormData({
      appointmentDate: "",
      appointmentTime: "",
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
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={10}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header as="h5" className="mb-4 text-center">
                Запись на прием
              </Card.Header>
              <Card.Body>
                <Form.Group as={Row} className="mb-4">
                  <Col md={6}>
                    <DatePicker
                      id="appointmentDate"
                      name="appointmentDate"
                      selected={formData.appointmentDate}
                      onChange={handleDateChange}
                      locale="ru"
                      dateFormat="dd.MM.yyyy"
                      minDate={new Date()}
                      className="form-control shadow"
                      placeholderText="Выберите дату"
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <DatePicker
                      id="appointmentTime"
                      name="appointmentTime"
                      selected={formData.appointmentTime}
                      onChange={handleTimeChange}
                      locale="ru"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Время"
                      dateFormat="HH:mm"
                      className="form-control shadow"
                      placeholderText="Выберите время"
                      required
                    />
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
                    removePet={removePet}
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
                    <Button size="sm" onClick={addPet} className="me-2">
                      <FaPlus />
                    </Button>
                  </OverlayTrigger>

                  <Button
                    type="submit"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Регистрация записи на прием..." />
                    ) : (
                      "Записаться"
                    )}
                  </Button>

                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleReset}
                  >
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
