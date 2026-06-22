import { getTodo } from "../../actions/todoActions";
import TodoForm from "../../components/TodoForm";
import { notFound } from "next/navigation";

export default async function EditTodoPage({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;
  
  try {
    const todo = await getTodo(Number(todoId));
    return (
      <main className="max-w-3xl mx-auto p-6 min-h-screen">
        <TodoForm initialData={todo} />
      </main>
    );
  } catch (error) {
    notFound();
  }
}
