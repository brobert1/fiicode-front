import { checkAuth, withAuth } from "@auth";
import { FloatingMenu } from "@components";
import BaseClientLayout from "@components/BaseClientLayout";
import { useTodos } from "@hooks";
import { TodoForm, TodoList, RouteMapModal } from "@components/Todo";
import { useRouter } from "next/router";
import { useState } from "react";

const Page = () => {
  const {
    todos,
    currentDate,
    addTodo,
    completeTodo,
    deleteTodo,
    saveRouteAndNavigate,
    activeTodosCount,
  } = useTodos();

  const [showRouteMap, setShowRouteMap] = useState(false);
  const router = useRouter();

  const handleGenerateRoute = () => {
    if (saveRouteAndNavigate()) {
      router.push("/client");
    }
  };

  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      <div className="w-full flex bg-white flex-col gap-8 py-6 px-4 max-w-4xl mx-auto">
        <div className="ml-4">
          <h1 className="text-2xl text-secondary font-bold">Today's task list</h1>
          <p className="text-gray-500 text-sm mt-1">{currentDate}</p>
        </div>

        <TodoForm onAddTodo={addTodo} />

        <TodoList
          todos={todos}
          onComplete={completeTodo}
          onDelete={deleteTodo}
          activeTodosCount={activeTodosCount}
          onGenerateRoute={handleGenerateRoute}
        />

        <RouteMapModal
          isOpen={showRouteMap}
          onClose={() => setShowRouteMap(false)}
          todos={todos.filter((todo) => !todo.completed)}
        />
      </div>
    </BaseClientLayout>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
