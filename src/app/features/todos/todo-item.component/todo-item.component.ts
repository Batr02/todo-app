import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Priority, Todo } from '../../../models/todo.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-todo-item',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Input() loading = false;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{ todo: Todo; newTitle: string }>();

  readonly priorityConfig: Record<Priority, { icon: string; class: string; label: string }> = {
  high:   { icon: 'keyboard_double_arrow_up',   class: 'priority-high',   label: 'High'   },
  medium: { icon: 'drag_handle',                class: 'priority-medium', label: 'Medium' },
  low:    { icon: 'keyboard_double_arrow_down', class: 'priority-low',    label: 'Low'    },
};

  isEditing = false;
  editControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
  ]);

  startEdit(): void {
    this.isEditing = true;
    this.editControl.setValue(this.todo.title);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editControl.reset();
  }

  confirmEdit(): void {
    if (this.editControl.valid && this.editControl.value) {
      this.edit.emit({ todo: this.todo, newTitle: this.editControl.value.trim() });
      this.isEditing = false;
    }
  }

}
