import {computed, Injectable, OnDestroy, signal} from '@angular/core';
import {ToastMessage} from './inu-toast.model';
import {TTLWrapper} from 'inugami-ng/models';
import {UuidUtils} from 'inugami-ng/services';

@Injectable({providedIn: 'root'})
export class InuToastServices implements OnDestroy {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  private _messages = signal<TTLWrapper<ToastMessage>[]>([]);
  private intervalId: number;
  public message = computed(() => this.extractMessage());

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    this.intervalId = setInterval(() => this.clearMessage(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private clearMessage() {
    const keepMessage: TTLWrapper<ToastMessage>[] = [];
    const now = new Date().getTime();

    const currentMessage = this._messages();
    for (let i = 0; i < currentMessage.length; i++) {
      const message = currentMessage[i];
      if (message.ttl > now) {
        keepMessage.push(message);
      }
    }
    this._messages.set(keepMessage);

  }

  //====================================================================================================================
  // API
  //====================================================================================================================
  addMessage(message: ToastMessage) {
    const delay = message.delay && message.delay > 1000 ? message.delay : 5000;
console.log('add message')
    this._messages.update(prev => [...prev, {
      id: UuidUtils.buildUid(),
      ttl: new Date().getTime() + delay,
      value: message
    }]);
  }


  private extractMessage(): ToastMessage[] {
    const result: ToastMessage[] = [];
    const currentMessages = this._messages();
    for (let message of currentMessages) {
      if (message.value) {
        result.push(message.value)
      }
    }
    return result;
  }
}
