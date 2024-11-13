import React, { useState, useEffect } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Form, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { findAvailableVeterinarians } from "./VeterinarianService";
import AlertMessage from "../common/AlertMessage";
import { dateTimeFormatter } from "../utils/utilities";
import { getAllSpecializations } from "./VeterinarianService";

registerLocale("ru", ru);

const VeterinarianSearch = ({ onSearchResult }) => {
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    date: null,
    time: null,
    specialization: "",
  });
  const [showDateTime, setShowDateTime] = useState(false);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  const handleInputChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setSearchQuery({
      ...searchQuery,
      date,
    });
  };

  const handleTimeChange = (time) => {
    setSearchQuery({
      ...searchQuery,
      time,
    });
  };

  const handleDateTimeToggle = (e) => {
    const isChecked = e.target.checked;
    setShowDateTime(isChecked);
    if (isChecked) {
      setSearchQuery((prevQuery) => ({
        ...prevQuery,
        date: null,
        time: null,
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const { date, time } = searchQuery;
    const { formattedDate, formattedTime } = dateTimeFormatter(date, time);

    let searchParams = { specialization: searchQuery.specialization };

    if (searchQuery.date) {
      searchParams.date = formattedDate;
    }

    if (searchQuery.time) {
      searchParams.time = formattedTime;
    }
    try {
      const response = await findAvailableVeterinarians(searchParams);
      onSearchResult(response.data);
      setShowErrorAlert(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
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
      time: null,
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
            required
          >
            <option value="">Выберите специализацию</option>
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
                    <Form.Label htmlFor="date" className="hidden">
                      Дата
                    </Form.Label>
                    <DatePicker
                      selected={searchQuery.date}
                      onChange={handleDateChange}
                      locale="ru"
                      dateFormat="dd.MM.yyyy"
                      minDate={new Date()}
                      className="form-control"
                      placeholderText="Выберите дату"
                      required={showDateTime}
                      id="date"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="time" className="hidden">
                      Время
                    </Form.Label>
                    <DatePicker
                      selected={searchQuery.time}
                      onChange={handleTimeChange}
                      locale="ru"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Время"
                      dateFormat="HH:mm"
                      className="form-control"
                      placeholderText="Выберите время"
                      required={showDateTime}
                      id="time"
                    />
                  </Form.Group>
                </React.Fragment>
              )}
            </Col>
          </Row>
        </fieldset>

        <div className="d-flex mb-4">
          <Button type="submit" variant="outline-primary">
            Поиск
          </Button>
          <div className="mx-2">
            <Button
              type="button"
              variant="outline-info"
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
