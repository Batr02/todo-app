import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Priority } from '../../../models/todo.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todo-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  @Output() addTodo = new EventEmitter<{ title: string; priority: Priority }>()

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    priority: new FormControl<Priority>('medium', Validators.required),
  });

   priorities: { value: Priority; label: string; icon: string }[] = [
    { value: 'high',   label: 'High',   icon: 'keyboard_double_arrow_up' },
    { value: 'medium', label: 'Medium', icon: 'drag_handle'              },
    { value: 'low',    label: 'Low',    icon: 'keyboard_double_arrow_down'},
  ];

  submit(): void {
    if (this.form.valid) {
      this.addTodo.emit({
        title: this.form.value.title!.trim(),
        priority: this.form.value.priority!,
      });
      this.form.reset({ priority: 'medium' });
    }
  }
}
