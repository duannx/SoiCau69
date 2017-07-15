import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

export class Loto {
  loto: string;
  value: number;
  selected: boolean;
  constructor() {
    this.loto = "00";
    this.value = 0;
    this.selected = false;
  }
}
@IonicPage()
@Component({
  selector: 'page-modal-loto-number',
  templateUrl: 'modal-loto-number.html',
})
export class ModalLotoNumberPage {
  lotos: Array<Loto> = [];
  lotos_selected: Array<Loto> = [];
  constructor(public mViewController: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.createLotos();
    let datas = this.navParams.get("lotos");
    for (let data of datas) {
      this.lotos[data.value].selected = true;
      this.lotos_selected.push(this.lotos[data.value]);
    }
  }
  createLotos() {
    for (let i = 0; i <= 99; i++) {
      let loto = new Loto();
      loto.loto = ((i < 10) ? "0" : "") + i;
      loto.value = i;
      this.lotos.push(loto);
      if (i < 9) this.lotos_selected.push(loto);
    }
  }
  onClickSubmit() {
    this.mViewController.dismiss({
      lotos: this.lotos_selected,
      cancel: false
    });
  }
  onClickBack() {
    this.mViewController.dismiss({
      lotos: this.lotos_selected,
      cancel: true
    });
  }
  onClickLoto(loto) {
    loto.selected = !loto.selected;
    this.lotos_selected = [];
    for (let lt of this.lotos) {
      if (lt.selected) this.lotos_selected.push(lt);
    }
  }
  onClickSelectAll() {
    this.lotos_selected = this.lotos;
    for (let loto of this.lotos) {
      loto.selected = true;
    }
  }
  onClickDeselectAll() {
    this.lotos_selected = [];
    for (let loto of this.lotos) {
      loto.selected = false;
    }
  }
}
