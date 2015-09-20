/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, Injectable} from 'angular2/angular2';

@Injectable()
class MetricsStore {
  getTest() {
    return 'From class';
  }
}

@Component({
  selector: 'top-nav'
})
@View({
  templateUrl: 'views/topNav.html'
})
class TopNavComponent {
}

@Component({
  selector: 'card',
  viewBindings: [MetricsStore]
})
@View({
  templateUrl: 'views/card.html'
})
class CardComponent {
  test: string;

  constructor(/*public store: MetricsStore*/) {
    //this.test = store.getTest();
  }
}

@Component({
  selector: 'layout'
})
@View({
  templateUrl: 'views/layout.html',
  directives: [CardComponent]
})
class LayoutComponent {
}

@Component({
  selector: 'my-app'
})
@View({
  template: `
    <div class='container-fluid'>
      <top-nav></top-nav>
      <layout></layout>
    </div>
  `,
  directives: [TopNavComponent, LayoutComponent]
})
class MyAppComponent {
  name: string;

  constructor() {
    this.name = 'Alice';
  }
}

bootstrap(MyAppComponent);
