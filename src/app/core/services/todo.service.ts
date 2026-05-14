import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CreateTodoDto, Todo } from '../../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly API = 'https://jsonplaceholder.typicode.com/todos';
  private readonly USER_ID = 1;

  private http = inject(HttpClient);


  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  loadTodos(): void {
    this.loadingSubject.next(true);
    this.http
      .get<Todo[]>(`${this.API}?userId=${this.USER_ID}&_limit=10`)
      .subscribe({
        next: (todos) => {
          this.todosSubject.next(todos);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false),
      });
  }

  addTodo(title: string): Observable<Todo> { 
    const dto: CreateTodoDto = {
      title,
      completed: false,
      userId: this.USER_ID,
    };
    return this.http.post<Todo>(this.API, dto).pipe(
      tap((newTodo) => {
        const todo = { ...newTodo, id: Date.now() };
        const current = this.todosSubject.getValue();
        this.todosSubject.next([todo, ...current]);
      })
    );
  }

  toggleTodo(todo: Todo): Observable<Todo> {
    const updated = { ...todo, completed: !todo.completed };
    return this.http.put<Todo>(`${this.API}/${todo.id}`, updated).pipe(
      tap(() => {
        const todos = this.todosSubject.getValue().map((t) =>
          t.id === todo.id ? updated : t
        );
        this.todosSubject.next(todos);
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`).pipe(
      tap(() => {
        const todos = this.todosSubject.getValue().filter((t) => t.id !== id);
        this.todosSubject.next(todos);
      })
    );
  }
}
