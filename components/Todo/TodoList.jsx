import React from "react";
import { Button } from "@components";
import TodoItem from "./TodoItem";

const TodoList = ({
  todos,
  onComplete,
  onDelete,
  activeTodosCount,
  onGenerateRoute
}) => {
  return (
    <div className="mt-8 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Todos</h2>
        {activeTodosCount > 1 && (
          <Button
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-gray-800"
            onClick={onGenerateRoute}
          >
            Generate Route
          </Button>
        )}
      </div>
      {todos.length === 0 ? (
        <p className="text-gray-500 ml-4">No todos yet. Add some above!</p>
      ) : (
        <div>
          {todos.map((todo, index) => (
            <TodoItem
              key={index}
              todo={todo}
              index={index}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
