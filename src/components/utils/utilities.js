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
  ADMIN: "ADMIN",
};

export const getStatusKey = (status) => {
  return status.toLowerCase().replace(/_/g, "-");
};

export function formatAppointmentStatus(status) {
  const statusTranslations = {
    CANCELLED: "Отменён клиентом",
    ON_GOING: "В процессе",
    UP_COMING: "Предстоящий",
    APPROVED: "Подтверждён ветеринаром",
    NOT_APPROVED: "Не подтверждён ветеринаром",
    WAITING_FOR_APPROVAL: "Ожидает подтверждения от ветеринара",
    COMPLETED: "Прием завершён",
  };

  return statusTranslations[status] || status;
}

export const generateColor = (str) => {
  if (typeof str !== "string" || str.length === 0) {
    return "#8884d8";
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};
