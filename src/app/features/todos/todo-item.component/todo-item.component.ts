import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-item.component',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Input() loading = false;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();
}
