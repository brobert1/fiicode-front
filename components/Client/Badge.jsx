import { classnames } from "@lib";
import Tooltip from "../Tooltip";
import { Trim } from "@components";

const Badge = ({ image, name, earned = false, description }) => {
  return (
    <div
      className={classnames(
        "flex flex-col items-center p-6 rounded-lg w-[180px] min-w-[180px] relative",
        earned ? "border border-gray-200" : "border border-dashed border-gray-300"
      )}
    >
      <div className="absolute top-2 right-2">
        <Tooltip placement="top" trigger="click">
          <div className="p-2">
            <p className="font-bold">{name}</p>
            <p className="text-sm">{description}</p>
          </div>
        </Tooltip>
      </div>
      <div
        className={classnames(
          "w-20 h-20 flex items-center justify-center rounded-full mb-4 overflow-hidden",
          !earned && "bg-gray-100"
        )}
      >
        <img
          src={image}
          alt={name}
          className={classnames("w-20 h-20 object-contain", !earned && "opacity-10")}
        />
      </div>
      <Trim className="text-lg font-bold mb-1 text-center" value={name} limit={20} />
      <p className="text-xs text-center text-gray-500">{earned ? "Earned" : "Not earned"}</p>
    </div>
  );
};

export default Badge;
