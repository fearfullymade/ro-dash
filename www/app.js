/// <reference path="typings/angular2/angular2.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var angular2_1 = require('angular2/angular2');
var MetricsStore = (function () {
    function MetricsStore() {
    }
    MetricsStore.prototype.getTest = function () {
        return 'From class';
    };
    MetricsStore = __decorate([
        angular2_1.Injectable()
    ], MetricsStore);
    return MetricsStore;
})();
var TopNavComponent = (function () {
    function TopNavComponent() {
    }
    TopNavComponent = __decorate([
        angular2_1.Component({
            selector: 'top-nav'
        }),
        angular2_1.View({
            templateUrl: 'views/topNav.html'
        })
    ], TopNavComponent);
    return TopNavComponent;
})();
var CardComponent = (function () {
    function CardComponent() {
        //this.test = store.getTest();
    }
    CardComponent = __decorate([
        angular2_1.Component({
            selector: 'card',
            viewBindings: [MetricsStore]
        }),
        angular2_1.View({
            templateUrl: 'views/card.html'
        })
    ], CardComponent);
    return CardComponent;
})();
var LayoutComponent = (function () {
    function LayoutComponent() {
    }
    LayoutComponent = __decorate([
        angular2_1.Component({
            selector: 'layout'
        }),
        angular2_1.View({
            templateUrl: 'views/layout.html',
            directives: [CardComponent]
        })
    ], LayoutComponent);
    return LayoutComponent;
})();
var MyAppComponent = (function () {
    function MyAppComponent() {
        this.name = 'Alice';
    }
    MyAppComponent = __decorate([
        angular2_1.Component({
            selector: 'my-app'
        }),
        angular2_1.View({
            template: "\n    <div class='container-fluid'>\n      <top-nav></top-nav>\n      <layout></layout>\n    </div>\n  ",
            directives: [TopNavComponent, LayoutComponent]
        })
    ], MyAppComponent);
    return MyAppComponent;
})();
angular2_1.bootstrap(MyAppComponent);
