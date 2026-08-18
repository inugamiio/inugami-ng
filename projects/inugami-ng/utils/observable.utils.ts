import {Observable, Subscriber} from 'rxjs'

export class ObservableSubscriber<T> {
  private result$: Observable<T>;
  private handlers: Subscriber<T>[] = [];

  constructor() {
    this.result$ = new Observable<T>((subscriber: Subscriber<T>) => {
      this.handlers.push(subscriber);
    });
  }

  observable(): Observable<T> {
    return this.result$;
  }

  subscriber(): Subscriber<T>[] {
    return this.handlers;
  }

  unsubscribe() {
    this.handlers.map(s => s.unsubscribe());
  }

  onNextValue(value: T): void {
    for (let handler of this.handlers) {
      try {
        handler.next(value);
      } catch (e) {
        console.error(e);
      }
    }
  }

  next(value: T): void {
    for (let handler of this.handlers) {
      try {
        handler.next(value);
        handler.complete();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
