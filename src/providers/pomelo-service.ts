import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PomeloService {
  mPomelo : any;
  constructor() {
   
  }
  create(){
    this.mPomelo = window['pomelo'];
  }

  
}
