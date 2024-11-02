const NoDataAvailable = ({ dataType, errorMessage }) => {
  let message;

  switch (dataType) {
    case "appointment data":
      message = "У вас нет записей на приём";
      break;
    case "review data":
      message = "У вас нет отзывов";
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
