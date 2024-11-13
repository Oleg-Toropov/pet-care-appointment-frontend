import { useState } from "react";
import ActionButtons from "./ActionButtons";
import ProcessSpinner from "../common/ProcessSpinner";

const VeterinarianActions = ({
  onApprove,
  onDecline,
  isDisabled,
  appointment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  const handleActionClick = (actionType) => {
    setIsProcessing(true);
    setProcessingAction(actionType);
    if (actionType === "Approve") {
      onApprove(appointment.id)
        .then(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        })
        .catch(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        });
    } else {
      onDecline(appointment.id)
        .then(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        })
        .catch(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        });
    }
  };
  return (
    <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
      <ActionButtons
        title={
          isProcessing && processingAction === "Approve" ? (
            <ProcessSpinner message="Подтверждение приема..." />
          ) : (
            "Подтвердить прием"
          )
        }
        variant={"success"}
        onClick={() => handleActionClick("Approve")}
        disabled={isDisabled}
        isProcessing={isProcessing}
      />
      <ActionButtons
        title={
          isProcessing && processingAction === "Decline" ? (
            <ProcessSpinner message="Отказ от приема..." />
          ) : (
            "Отказаться от приема"
          )
        }
        variant={"secondary"}
        onClick={() => handleActionClick("Decline")}
        disabled={isDisabled}
        isProcessing={isProcessing}
      />
    </section>
  );
};

export default VeterinarianActions;
