import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { TodoService } from '../../../core/services/todo.service';
import { TodoFilter, Todo, Priority, TodoSort } from '../../../models/todo.model';
import { TodoItemComponent } from '../todo-item.component/todo-item.component';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-todo-list',
  imports: [
    AsyncPipe,
    TodoFormComponent,
    MatButtonToggleModule,
    MatDividerModule,
    TodoItemComponent,
    MatIconModule
],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  private filterSubject = new BehaviorSubject<TodoFilter>('all');
  filter$ = this.filterSubject.asObservable();

  private sortSubject = new BehaviorSubject<TodoSort>('none');
  sort$ = this.sortSubject.asObservable();

  private readonly priorityWeight: Record<Priority, number> = {
    high: 3, medium: 2, low: 1,
  };

  filteredTodos$ = combineLatest([
    this.todoService.todos$,
    this.filter$,
    this.sort$,
  ]).pipe(
    map(([todos, filter, sort]) => {
      let result = todos;
      if (filter === 'active')    result = todos.filter((t) => !t.completed);
      if (filter === 'completed') result = todos.filter((t) => t.completed);

      if (sort === 'none') return result;
      return [...result].sort((a, b) => {
        const diff = this.priorityWeight[b.priority] - this.priorityWeight[a.priority];
        return sort === 'asc' ? -diff : diff;
      });
    })
  );

  stats$ = this.todoService.todos$.pipe(
    map((todos) => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
    }))
  );

  setFilter(filter: TodoFilter): void {
    this.filterSubject.next(filter);
  }

  setSort(sort: TodoSort): void {
    this.sortSubject.next(sort);
  }

  onAdd(event: { title: string; priority: Priority }): void {
    this.todoService.addTodo(event.title, event.priority).subscribe({
      next: () => this.notify('✅ Task added'),
      error: () => this.notify('❌ Error adding task', true),
    });
  }

  onToggle(todo: Todo): void {
    this.todoService.toggleTodo(todo).subscribe({
      error: () => this.notify('❌ Error updating task', true),
    });
  }

  onDelete(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.notify('🗑️ Task deleted'),
      error: () => this.notify('❌ Error deleting task', true),
    });
  }

  onEdit(event: { todo: Todo; newTitle: string }): void {
    this.todoService.updateTodo(event.todo, event.newTitle).subscribe({
      next: () => this.notify('✏️ Task updated'),
      error: () => this.notify('❌ Error updating task', true),
    });
  }

  private notify(msg: string, isError = false): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      panelClass: isError ? 'snack-error' : '',
    });
  }
}

