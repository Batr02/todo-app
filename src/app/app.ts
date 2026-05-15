import { Component, signal } from '@angular/core';
import { TodoListComponent } from './features/todos/todo-list.component/todo-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule, 
    MatCardModule, 
    MatIconModule, 
    TodoListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
