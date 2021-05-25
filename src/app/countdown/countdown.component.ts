import {Component, Input, VERSION} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {BehaviorSubject, Subject, timer} from "rxjs";
import {map, pairwise, switchMap, takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  animations: [
    trigger("flip",
      [
        transition('*=>*',
          [
            animate(".6s",
              keyframes(
                [
                  style({transform: "rotateX(0deg)", offset: 0}),
                  style({transform: "rotateX(-90deg)", offset: .5}),
                  style({transform: "rotateX(-180deg)", offset: 1}),
                ]
              )
            )
          ]
        )
      ]
    )
  ]
})
export class CountdownComponent {

  change: boolean = false;
  showShadow = [];
  name = "Angular " + VERSION.major;
  initialMinutes$ = new BehaviorSubject(30);
  expired$ = new Subject();

  @Input()
  set minutes(val: number) {
    this.initialMinutes$.next(val);
  }

  value = 0;
  timer$ = this.initialMinutes$.pipe(
    map(minutes => minutes * 60000 + new Date(2021, 8, 2, 13, 11, 0, 0).getTime()),
    switchMap(minutes =>
      timer(0, 1000).pipe(
        map(t => Math.round((minutes - new Date().getTime()) / 1000)),
        tap(seconds => {
          if (seconds < 0) {
            this.expired$.next();
          }
        }),
        takeUntil(this.expired$),
        map(seconds => ({
          hr: Math.max(Math.floor(seconds / 3600), 0),
          min: Math.max(Math.floor((seconds % 3600) / 60), 0),
          s: seconds % 60
        })),
        map(
          ({hr, min, s}) => [
            (hr > 1000 ? hr.toString() : (hr > 100) ? "0" + hr.toString() : (hr > 9) ? "00" + hr.toString() : "000" + hr.toString()) + ':',
            (min > 9 ? min.toString() : "0" + min.toString()) + ':',
            s > 9 ? s.toString() : "0" + s.toString()
          ]
        ),
        map(val => val.map(i => i.split("")).reduce((a, b) => [...a, ...b], [])),
        pairwise(),
        map(([old, value]) => {
          return value.map((x, index) => ({value: x, old: old[index]}))
        })
      )
    )
  );
}
