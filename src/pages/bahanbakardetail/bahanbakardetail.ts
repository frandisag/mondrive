import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, ToastController } from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the BahanbakardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bahanbakardetail',
  templateUrl: 'bahanbakardetail.html',
})
export class BahanbakardetailPage {

  public unregisterBackButtonAction: any;

  param = {
    "FuelChargerId": this.navParams.get('FuelChargerId'),
    "KwitansiPhoto": "",
    "BrandName":"",
    "PlatNo":"",
    "Price":"",
    "FuelChargerDate":"",
    "Note":"",
    "Volume":""
  }

  responseData: any

  constructor(
    public navCtrl: NavController, 
    public platform:Platform,
    public toastController: ToastController,
    public viewCtrl: ViewController,
    public connect: ConnectProvider,
    public navParams: NavParams) {

    console.log(this.param)
    this.connect.postData(this.param, "getDetailBahanBakar").then((result) =>{
      this.responseData = result;

      if(this.responseData.detailBahanBakar){
        this.param.KwitansiPhoto = this.responseData.detailBahanBakar.KwitansiPhoto
        this.param.BrandName = this.responseData.detailBahanBakar.BrandName
        this.param.PlatNo = this.responseData.detailBahanBakar.PlatNo
        this.param.Price = this.responseData.detailBahanBakar.Price
        this.param.FuelChargerDate = this.responseData.detailBahanBakar.FuelChargerDate
        this.param.Note = this.responseData.detailBahanBakar.Note 
        this.param.Volume = this.responseData.detailBahanBakar.Volume 
      }else{
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      this.presentToast("Koneksi Bermasalah");
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
