import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

const ActionButtons = ({
  children,
  variant,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
};

ActionButtons.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ActionButtons;
