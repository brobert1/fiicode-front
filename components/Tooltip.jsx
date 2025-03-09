import { OverlayTrigger, Tooltip as Popover } from "react-bootstrap";

const Tooltip = ({
  icon = "fas fa-question-circle",
  placement = "top",
  trigger = "hover",
  children,
}) => {
  return (
    <OverlayTrigger
      placement={placement}
      trigger={trigger}
      rootClose={trigger === "click"}
      overlay={<Popover className="tooltip">{children}</Popover>}
    >
      <div className="flex h-8 w-8 items-center justify-center text-secondary">
        <i className={icon}></i>
      </div>
    </OverlayTrigger>
  );
};

export default Tooltip;
