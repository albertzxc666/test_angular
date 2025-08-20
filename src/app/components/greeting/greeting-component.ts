import { Component, Input } from '@angular/core';

@Component({
  selector: 'greeting-component',
  imports: [],
  templateUrl: './greeting-component.html',
  styleUrl: './greeting-component.scss'
})
export class GreetingComponent {
  @Input() name: string = '';
}
