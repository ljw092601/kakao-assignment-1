import { getTodo } from "../../actions/todoActions";
import TodoForm from "../../components/TodoForm";
import { notFound } from "next/navigation";

export default async function EditTodoPage({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;
  
  try {
    const todo = await getTodo(Number(todoId));
    return (
      <main className="w-full max-w-4xl mx-auto p-6 md:p-10 min-h-screen">
        <TodoForm initialData={todo} />
      </main>
    );
  } catch (error) {
    notFound();
  }
}
