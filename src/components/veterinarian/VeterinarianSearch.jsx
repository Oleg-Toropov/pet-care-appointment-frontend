import React, { useState, useEffect } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Form, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";
import {
  findAvailableVeterinarians,
  getAllSpecializations,
} from "./VeterinarianService";
import AlertMessage from "../common/AlertMessage";

registerLocale("ru", ru);

const VeterinarianSearch = ({ onSearchResult }) => {
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    date: null,
    time: "",
    specialization: "",
  });
  const [showDateTime, setShowDateTime] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  const handleInputChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };

  const formatDateTime = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    const formattedDate = appointmentDateTime.toISOString().split("T")[0];
    const formattedTime = appointmentDateTime.toTimeString().split(" ")[0];
    return { formattedDate, formattedTime };
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour < 20; hour++) {
      times.push(`${hour.toString().padStart(2, "0")}:00`);
      times.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    times.push("20:00");
    return times;
  };

  const handleDateSelect = (date) => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      date,
      time: "",
    }));
    setAvailableTimes(generateTimeSlots());
  };

  const handleTimeSelect = (time) => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      time,
    }));
  };

  const handleDateTimeToggle = (e) => {
    const isChecked = e.target.checked;
    setShowDateTime(isChecked);
    if (isChecked) {
      setSearchQuery((prevQuery) => ({
        ...prevQuery,
        date: null,
        time: "",
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const { date, time, specialization } = searchQuery;

    if (!specialization) {
      setErrorMessage("Пожалуйста, выберите специализацию.");
      setShowErrorAlert(true);
      return;
    }

    if (showDateTime) {
      if (!date) {
        setErrorMessage("Пожалуйста, выберите дату.");
        setShowErrorAlert(true);
        return;
      }
      if (!time) {
        setErrorMessage("Пожалуйста, выберите время.");
        setShowErrorAlert(true);
        return;
      }
    }

    let formattedDate = "";
    let formattedTime = "";

    if (date && time) {
      const formatted = formatDateTime(date, time);
      formattedDate = formatted.formattedDate;
      formattedTime = formatted.formattedTime;
    }

    const searchParams = {
      specialization,
      ...(formattedDate && { date: formattedDate }),
      ...(formattedTime && { time: formattedTime }),
    };

    try {
      const response = await findAvailableVeterinarians(searchParams);
      onSearchResult(response.data);
      setShowErrorAlert(false);
    } catch (error) {
      onSearchResult(null);
      setErrorMessage(error.response?.data?.message || "Ошибка поиска");
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    getAllSpecializations()
      .then((data) => {
        setSpecializations(data.data || data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  const handleClearSearch = () => {
    setSearchQuery({
      date: null,
      time: "",
      specialization: "",
    });
    setShowDateTime(false);
    setShowErrorAlert(false);
    setErrorMessage("");
    onSearchResult(null);
  };

  return (
    <section className="stickyFormContainer">
      <h4>Поиск ветеринара</h4>
      <Form onSubmit={handleSearch}>
        <Form.Group>
          <Form.Label htmlFor="specialization" className="hidden">
            Специализация
          </Form.Label>
          <Form.Control
            as="select"
            id="specialization"
            name="specialization"
            value={searchQuery.specialization}
            onChange={handleInputChange}
          >
            <option value="" disabled hidden>
              Выберите специализацию
            </option>
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <fieldset>
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3 mt-3">
                <Form.Check
                  type="checkbox"
                  id="date-time-checkbox"
                  label="Выбрать дату и время"
                  checked={showDateTime}
                  onChange={handleDateTimeToggle}
                />
              </Form.Group>
              {showDateTime && (
                <React.Fragment>
                  <Form.Group className="mb-3">
                    <h5>Выберите дату:</h5>
                    <DatePicker
                      selected={searchQuery.date}
                      onChange={handleDateSelect}
                      locale="ru"
                      dateFormat="dd.MM.yyyy"
                      placeholderText="Нажмите для выбора даты"
                      minDate={new Date()}
                      maxDate={
                        new Date(new Date().setDate(new Date().getDate() + 30))
                      }
                      className="form-control"
                    />
                  </Form.Group>

                  {searchQuery.date && (
                    <div className="time-container">
                      <h5>Выберите время:</h5>
                      <div className="time-grid">
                        {availableTimes.map((time) => (
                          <button
                            type="button"
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`time-button ${
                              time === searchQuery.time ? "selected" : ""
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )}
            </Col>
          </Row>
        </fieldset>

        <div className="d-flex mb-4">
          <Button type="submit" className="custom-button">
            Поиск
          </Button>
          <div className="mx-2">
            <Button
              type="button"
              className="custom-button-light"
              onClick={handleClearSearch}
            >
              Сбросить поиск
            </Button>
          </div>
        </div>
      </Form>
      <div>
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
      </div>
    </section>
  );
};

export default VeterinarianSearch;
