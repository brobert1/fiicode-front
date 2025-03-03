import { classnames } from "@lib";

const Trim = ({ extraClass, value, limit }) => {
  if (!value) {
    return "";
  }

  const format = (value, limit) => {
    if (value.length < limit) {
      return value;
    }
    return (
      <>
        <span>{value.substring(0, limit)}</span>
        <span>...</span>
      </>
    );
  };

  return (
    <div
      className={classnames("cursor-default overflow-x-auto whitespace-nowrap", extraClass)}
      title={value}
    >
      {format(value, limit)}
    </div>
  );
};

export default Trim;
