import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

class Loto {
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
  selector: 'page-modal-loto',
  templateUrl: 'modal-loto.html',
})
export class ModalLotoPage {
  lotos: Array<Loto> = [];
  lotos_selected: Array<Loto> = [];
  constructor(public mViewController: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.createLotos();
    let datas = this.navParams.get("lotos");
    if (datas) {
      for (let data of datas) {
        this.lotos[data.value].selected = true;
        this.lotos_selected.push(this.lotos[data.value]);
      }
    }
  }
  ionViewDidEnter() {
    let ele = document.getElementById("iContent");
    ele.style.transform = "translateY(0)";
  }
  createLotos() {
    for (let i = 0; i < 100; i++) {
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
    }, '', {
        animate: false
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
