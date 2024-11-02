import { useState } from "react";
import ActionButtons from "./ActionButtons";

const VeterinarianActions = ({
  onApprove,
  onDecline,
  isDisabled,
  appointment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActionClick = (actionType) => {
    setIsProcessing(true);
    if (actionType === "Approve") {
      onApprove(appointment.id)
        .then(() => {
          setIsProcessing(false);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    } else {
      onDecline(appointment.id)
        .then(() => {
          setIsProcessing(false);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  };
  return (
    <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
      <ActionButtons
        title={"Подтвердить прием"}
        variant={"success"}
        onClick={() => handleActionClick("Approve")}
        disabled={isDisabled}
        isProcessing={isProcessing}
      />
      <ActionButtons
        title={"Отказаться от приема"}
        variant={"secondary"}
        onClick={() => handleActionClick("Decline")}
        disabled={isDisabled}
        isProcessing={isProcessing}
      />
    </section>
  );
};

export default VeterinarianActions;
