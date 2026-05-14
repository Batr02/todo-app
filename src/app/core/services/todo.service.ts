import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../../models/todo.model';

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


}
