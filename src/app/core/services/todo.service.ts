import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
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

  addTodo(title: string): Observable<Todo> { 
    const dto: CreateTodoDto = {
      title,
      completed: false,
      userId: this.USER_ID,
    };
    return this.http.post<Todo>(this.API, dto).pipe(
      tap((newTodo) => {
        console.log('Sent:', dto);
        console.log('Received:', newTodo);

        const todo = { ...newTodo, id: Date.now() }; 
        // const todo = { ...newTodo, id: Math.floor(Math.random() * 200) + 1 }; generates a random number between 1 and 200 to check if data is being updated on server.
        const current = this.todosSubject.getValue();
        this.todosSubject.next([todo, ...current]);
      })
    );
  }

  toggleTodo(todo: Todo): Observable<Todo> {
    const updated = { ...todo, completed: !todo.completed };
    
    if (todo.id > 200) {
    console.log('local update:', updated);
    this.todosSubject.next(
      this.todosSubject.getValue().map((t) => (t.id === todo.id ? updated : t))
    );
    return of(updated);
  }
  
    return this.http.put<Todo>(`${this.API}/${todo.id}`, updated).pipe(
      tap((response) => {
        console.log('Sent:', updated);
        console.log('Server response:', response);

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
        console.log('Deleted id:', id);

        const todos = this.todosSubject.getValue().filter((t) => t.id !== id);
        this.todosSubject.next(todos);
      })
    );
  }

  updateTodo(todo: Todo, newTitle: string): Observable<Todo> {
    const updated = { ...todo, title: newTitle };

    if (todo.id > 200) {
      console.log('Local update (no request):', updated);
      this.todosSubject.next(
        this.todosSubject.getValue().map((t) => (t.id === todo.id ? updated : t))
      );
      return of(updated);
    }

    return this.http.put<Todo>(`${this.API}/${todo.id}`, updated).pipe(
      tap((response) => {
        console.log('Sent:', updated);
        console.log('Server response:', response);

        this.todosSubject.next(
          this.todosSubject.getValue().map((t) => (t.id === todo.id ? updated : t))
        );
      })
    );
  }
}
