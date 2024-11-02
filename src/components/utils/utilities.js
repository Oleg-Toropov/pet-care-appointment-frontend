import { useEffect, useState } from "react";
import { format } from "date-fns";

export const useAlertWithTimeout = (
  initialVisibility = false,
  duration = 10000
) => {
  const [isVisible, setIsVisible] = useState(initialVisibility);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isVisible, duration]);

  return [isVisible, setIsVisible];
};

export const dateTimeFormatter = (date, time) => {
  const formattedDate = format(date, "dd.MM.yyyy");
  const formattedTime = format(time, "HH:mm");
  return { formattedDate, formattedTime };
};

export const UserType = {
  PATIENT: "PATIENT",
  VET: "VET",
};

export const getStatusKey = (status) => {
  return status.toLowerCase().replace(/_/g, "-");
};

export function formatAppointmentStatus(status) {
  const statusTranslations = {
    CANCELLED: "Отменён",
    ON_GOING: "В процессе",
    UPCOMING: "Предстоящий",
    APPROVED: "Подтверждён",
    NOT_APPROVED: "Не подтверждён",
    WAITING_FOR_APPROVAL: "Ожидает подтверждения",
    PENDING: "В ожидании",
    COMPLETED: "Завершён",
  };

  return statusTranslations[status] || status;
}
