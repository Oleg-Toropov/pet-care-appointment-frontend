import React, { useState } from "react";
import { format } from "date-fns";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Form, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { findAvailableVeterinarians } from "./VeterinarianService";
import AlertMessage from "../common/AlertMessage";

registerLocale("ru", ru);

const VeterinarianSearch = ({ onSearchResult }) => {
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
      setSearchQuery(
        prevQuery({
          ...searchQuery,
          date: null,
          time: null,
        })
      );
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    let searchParams = { specialization: searchQuery.specialization };

    if (searchQuery.date) {
      const formattedDate = format(searchQuery.date, "dd-MM-yyyy");
      searchParams.date = formattedDate;
    }

    if (searchQuery.time) {
      const formattedTime = format(searchQuery.time, "HH:mm");
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

  const handleClearSearch = () => {
    setSearchQuery({
      date: null,
      time: null,
      specialization: "",
    });
    setShowDateTime(false);
    onSearchResult(null);
  };

  return (
    <section className="stickyFormContainer">
      <h3>Поиск ветеринара</h3>
      <Form onSubmit={handleSearch}>
        <Form.Group>
          <Form.Label>Специализация</Form.Label>
          <Form.Control
            as="select"
            name="specialization"
            value={searchQuery.specialization}
            onChange={handleInputChange}
          >
            <option value="">Выберите специализацию</option>
            <option value="Терапевт">Терапевт</option>
            <option value="Хирург">Хирург</option>
            <option value="Кардиолог">Кардиолог</option>
            <option value="Невролог">Невролог</option>
            <option value="Офтальмолог">Офтальмолог</option>
            <option value="Дерматолог">Дерматолог</option>
            <option value="Ортопед">Ортопед</option>
            <option value="Стоматолог">Стоматолог</option>
            <option value="Рентгенолог">Рентгенолог</option>
            <option value="Онколог">Онколог</option>
            <option value="Анестезиолог">Анестезиолог</option>
            <option value="Гастроэнтеролог">Гастроэнтеролог</option>
            <option value="Реабилитолог">Реабилитолог</option>
            <option value="Инфекционист">Инфекционист</option>
            <option value="Уролог">Уролог</option>
            <option value="Эндокринолог">Эндокринолог</option>
            <option value="Репродуктолог">Репродуктолог</option>
            <option value="Экзотолог">Экзотолог</option>
            <option value="Паразитолог">Паразитолог</option>
            <option value="Аллерголог">Аллерголог</option>
          </Form.Control>
        </Form.Group>

        <fieldset>
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3 mt-3">
                <Form.Check
                  type="checkbox"
                  label="Выбрать дату и время"
                  checked={showDateTime}
                  onChange={handleDateTimeToggle}
                />
              </Form.Group>
              {showDateTime && (
                <React.Fragment>
                  <legend>Выбрать дату и время</legend>
                  <Form.Group className="mb-3">
                    <Form.Label className="searchText">Дата</Form.Label>
                    <DatePicker
                      selected={searchQuery.date}
                      onChange={handleDateChange}
                      locale="ru"
                      dateFormat="dd.MM.yyyy"
                      minDate={new Date()}
                      className="form-control"
                      placeholderText="Выберите дату"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="searchText">Время</Form.Label>
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
                      required
                    />
                  </Form.Group>
                </React.Fragment>
              )}
            </Col>
          </Row>
        </fieldset>

        <div className="d-flex justify-content-center mb-4">
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
