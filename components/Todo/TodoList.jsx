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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-secondary">Your Todos</h2>
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
        <div className="flex items-start ml-4">
          <p className="text-gray-500 text-lg">No todos yet. Add some above!</p>
        </div>
      ) : (
        <div className="space-y-3">
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
