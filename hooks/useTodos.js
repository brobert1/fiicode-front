import { useState, useEffect } from "react";
import { useProfile } from "@hooks";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const { me: user } = useProfile();
  const [currentDate, setCurrentDate] = useState("");

  // Set formatted current date on component mount
  useEffect(() => {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);

  // Load todos from localStorage and handle day change
  useEffect(() => {
    if (user?.me) {
      try {
        const storageKey = `todos_${user.me}`;
        const lastAccessDateKey = `todos_last_access_date_${user.me}`;

        const today = new Date().toISOString().split("T")[0];
        const lastAccessDate = localStorage.getItem(lastAccessDateKey);

        if (lastAccessDate && lastAccessDate !== today) {
          localStorage.removeItem(storageKey);
          setTodos([]);
        } else {
          const savedTodos = localStorage.getItem(storageKey);
          if (savedTodos) {
            const parsedTodos = JSON.parse(savedTodos);
            setTodos(parsedTodos);
          }
        }

        localStorage.setItem(lastAccessDateKey, today);
      } catch (error) {
        console.error("Error loading todos from localStorage:", error);
      }
    }
  }, [user?.me]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (user?.me) {
      try {
        const storageKey = `todos_${user.me}`;
        localStorage.setItem(storageKey, JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos to localStorage:", error);
      }
    }
  }, [todos, user?.me]);

  const addTodo = (newTodo) => {
    setTodos([...todos, { ...newTodo, completed: false }]);
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = true;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const saveRouteAndNavigate = () => {
    const activeTodos = todos.filter((todo) => !todo.completed);

    if (activeTodos.length < 2) {
      alert("Please add at least two active locations to generate a route");
      return false;
    }

    const todoLocations = activeTodos.map((todo) => ({
      location: todo.location,
      title: todo.title || todo.description,
    }));

    localStorage.setItem("todoRouteLocations", JSON.stringify(todoLocations));
    return true;
  };

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  return {
    todos,
    currentDate,
    addTodo,
    completeTodo,
    deleteTodo,
    saveRouteAndNavigate,
    activeTodosCount
  };
}
