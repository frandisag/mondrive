import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, ToastController } from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the KehadirandetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-kehadirandetail',
  templateUrl: 'kehadirandetail.html',
})
export class KehadirandetailPage {

  public unregisterBackButtonAction: any;

  param = {
    "AttendanceTime": this.navParams.get('AttendanceTime'),
    "EmployeeId": this.navParams.get('EmployeeId'),
    "PhotoLastKm": "",
    "BrandName":"",
    "PlatNo": "",
    "CarLastKm": ""
  }
  
  responseData: any

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public platform:Platform,
    public toastController: ToastController,
    public connect: ConnectProvider,
    public navParams: NavParams) {
    
    this.connect.postData(this.param, "getDetailKehadiran").then((result) =>{
      this.responseData = result;

      if(this.responseData.detailKehadiran){
        this.param.PhotoLastKm = this.responseData.detailKehadiran.PhotoLastKm
        this.param.BrandName = this.responseData.detailKehadiran.BrandName
        this.param.PlatNo = this.responseData.detailKehadiran.PlatNo
        this.param.CarLastKm = this.responseData.detailKehadiran.CarLastKm
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
