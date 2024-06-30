import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { of, tap } from 'rxjs';
import 'zone.js';

type Person = {
  id: number;
  firstName: string;
  lastName: string | undefined;
  town: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>

    @let personalInfoA = (personalInfo$ | async);
    <pre>personalInfoA: {{personalInfoA | json}}</pre>

    @let title = personalInfoA?.firstName + ' ' + personalInfoA?.lastName + ' of ' + personalInfoA?.town;
    <pre>{{title}}</pre>

    @let personalInfoB = $personalInfo().lastName;
    @if(personalInfoB) {
      <pre>lastName: {{personalInfoB | json}}</pre>
    }

    @if ($personalInfo().lastName) {
      <pre>lastName: {{$personalInfo().lastName | json}}</pre>
    }
  `,
  imports: [AsyncPipe, JsonPipe],
})
export class App {
  name = 'Angular';

  personalInfo$ = of<Person>({
    id: 1,
    firstName: 'Jeff',
    lastName: 'Smith',
    town: 'Farmington',
  }).pipe(tap(() => console.log('side effect (observable)')));

  $personalInfo = signal<Person>({
    id: 1,
    firstName: 'Jeff',
    lastName: 'Smith',
    town: 'Farmington',
  });

  $personalInfoEffect = effect(() => {
    this.$personalInfo();
    console.log('side effect (signal)');
  });

  ngOnInit() {
    this.$personalInfo.update((info) => ({ ...info, lastName: 'Jerryson' }));
  }

  g = this.$personalInfo().lastName;
}

bootstrapApplication(App);
