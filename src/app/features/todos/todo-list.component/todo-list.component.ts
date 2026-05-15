import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, map } from 'rxjs';
import { TodoService } from '../../../core/services/todo.service';
import { TodoFilter, Todo } from '../../../models/todo.model';
import { TodoItemComponent } from '../todo-item.component/todo-item.component';

@Component({
  selector: 'app-todo-list',
  imports: [
    AsyncPipe,
    TodoFormComponent,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDividerModule,
    TodoItemComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  loading$ = this.todoService.loading$;
  filter: TodoFilter = 'all';

  filteredTodos$ = combineLatest([this.todoService.todos$]).pipe(
    map(([todos]) => this.applyFilter(todos))
  );

  stats$ = this.todoService.todos$.pipe(
    map((todos) => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
    }))
  );

  ngOnInit(): void {
    this.todoService.loadTodos();
  }

  onAdd(title: string): void {
    this.todoService.addTodo(title).subscribe({
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

  private applyFilter(todos: Todo[]): Todo[] {
    if (this.filter === 'active') return todos.filter((t) => !t.completed);
    if (this.filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }

  private notify(msg: string, isError = false): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      panelClass: isError ? 'snack-error' : '',
    });
  }
}

