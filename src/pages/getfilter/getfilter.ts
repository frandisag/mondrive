import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, ToastController } from 'ionic-angular';

/**
 * Generated class for the GetfilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-getfilter',
  templateUrl: 'getfilter.html',
})
export class GetfilterPage {

  public unregisterBackButtonAction: any;

  param = {
    "startdate": this.navParams.get('startdate'),
    "enddate": this.navParams.get('enddate')
  }

  constructor(
  	public navCtrl: NavController, 
  	public viewCtrl: ViewController,
    public platform:Platform,
    public toastController: ToastController,
  	public navParams: NavParams) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  filter(){
    if (this.param.startdate > this.param.enddate) {
      this.presentToast("Tanggal awal melebihi tanggal akhir");
    }else{
      this.viewCtrl.dismiss(this.param);
    }
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true
    });
    toast.present();
  }

  clearstart() {
    this.param.startdate = null;
  }

  clearend() {
    this.param.enddate = null;
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.customHandleBackButton();
    }, 10);
  }

  private customHandleBackButton(): void {
    this.viewCtrl.dismiss();
  }

}
