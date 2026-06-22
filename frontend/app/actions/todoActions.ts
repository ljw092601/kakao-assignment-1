"use server"

import { revalidatePath } from "next/cache";
import { Todo, TodoCreate, TodoUpdate } from "../types/todo";

const API_URL = "http://127.0.0.1:8000/todos";

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_URL}/`, {
    cache: "no-store", // Always fetch latest
  });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch todo");
  return res.json();
}

export async function createTodo(data: TodoCreate): Promise<Todo> {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  
  revalidatePath("/todos");
  return res.json();
}

export async function updateTodo(id: number, data: TodoUpdate): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  
  revalidatePath("/todos");
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete todo");
  
  revalidatePath("/todos");
}
