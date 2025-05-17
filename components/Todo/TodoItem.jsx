import { Button } from "@components";

const TodoItem = ({ todo, onComplete, onDelete, index }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg mb-2 ${
        todo.completed ? "bg-gray-200" : "bg-gray-50"
      }`}
    >
      <div>
        <p className={`font-medium ${todo.completed ? "line-through text-gray-500" : ""}`}>
          {todo.description}
        </p>
        <p className="text-sm text-gray-500">
          Location: {todo.location.lat.toFixed(6)}, {todo.location.lng.toFixed(6)}
        </p>
        {todo.completed && <p className="text-sm text-green-600">Completed</p>}
      </div>
      <div className="flex space-x-2">
        {!todo.completed && (
          <Button className="text-green-600 hover:text-green-800" onClick={() => onComplete(index)}>
            <i className="fa-solid fa-check"></i>
          </Button>
        )}
        <Button className="text-red-500 hover:text-red-700" onClick={() => onDelete(index)}>
          <i className="fa-solid fa-trash"></i>
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;
