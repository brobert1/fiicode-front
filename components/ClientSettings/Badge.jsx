import { classnames } from "@lib";

const Badge = ({ icon, name, date, earned = true }) => {
  return (
    <div
      className={classnames(
        "flex flex-col items-center p-6 rounded-lg w-[180px] min-w-[180px]",
        earned ? "border border-gray-200" : "border border-dashed border-gray-300"
      )}
    >
      <div
        className={classnames(
          "w-16 h-16 flex items-center justify-center rounded-full mb-4",
          !earned && "bg-gray-100"
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-center text-gray-500">{earned ? date : "Not earned"}</p>
    </div>
  );
};

export default Badge;
