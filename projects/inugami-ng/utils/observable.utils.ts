import {Observable, Subscriber} from 'rxjs'

export class ObservableSubscriber<T> {
  private result$: Observable<T>;
  private handler ?: Subscriber<T>;

  constructor() {
    this.result$ = new Observable<T>((subscriber: Subscriber<T>) => {
      this.handler = subscriber;
    });
  }

  observable(): Observable<T> {
    return this.result$;
  }

  subscriber(): Subscriber<T> | undefined {
    return this.handler;
  }
}
