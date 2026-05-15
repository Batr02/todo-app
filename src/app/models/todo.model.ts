export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  priority: Priority;
}

export interface CreateTodoDto {
  title: string;
  completed: boolean;
  userId: number;
  priority: Priority;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'none' | 'asc' | 'desc';