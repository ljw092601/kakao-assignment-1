export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  date: string | null;
  created_at: string;
  updated_at: string;
}

export type TodoCreate = Pick<Todo, 'title' | 'description' | 'date'> & {
  completed?: boolean;
};

export type TodoUpdate = Partial<TodoCreate>;
