import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-todo-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  @Output() addTodo = new EventEmitter<string>();

  titleControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
  ]);

  submit(): void {
    if (this.titleControl.valid && this.titleControl.value) {
      this.addTodo.emit(this.titleControl.value.trim());
      this.titleControl.reset();
    }
  }
}
