const NoDataAvailable = ({ dataType, errorMessage }) => {
  let message;

  switch (dataType) {
    case "appointment data":
      message = "Нет ни одной записи на прием";
      break;
    case "review data":
      message = "Нет ни одного отзыва";
      break;
    case "user registration data":
      message = "Нет ни одного зарегистрированного пользователя";
      break;
    case "vet specialization data":
      message = "Нет ни одного зарегистрированного ветеринара";
      break;
    default:
      message = "Нет доступных данных";
      break;
  }

  return (
    <div className="text-center mt-5">
      <h4 className="legend">{message}</h4>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  );
};

export default NoDataAvailable;
