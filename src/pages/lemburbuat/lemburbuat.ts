import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, Platform, LoadingController, Events } from 'ionic-angular';
import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the LemburbuatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lemburbuat',
  templateUrl: 'lemburbuat.html',
})
export class LemburbuatPage {

  public unregisterBackButtonAction: any;
  simpanload: boolean = false;
	items: any;
  responseData: any;
  cars:any;
  employees:any;
  isEnabled: boolean = false;
  param = {
    "token":"",
    "EmployeeId":"",
    "Date": new Date().toISOString(),
    "StartOver":"",
    "EndOver":"",
    "Note":"",
    "FullName":""
  };

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
  	public toastController: ToastController,
  	public loadingCtrl: LoadingController,
    public platform:Platform,
    public events: Events,
  	public connect: ConnectProvider,
    public navParams: NavParams) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  simpan(){
    if(
      this.param.Date != "" 
      && this.param.StartOver != "" 
      && this.param.EndOver != ""){
      if(this.param.StartOver >= this.param.EndOver){
        this.presentToast("Cek Jam Akhir Lembur !");
      }else{
        const data = JSON.parse(localStorage.getItem('userData'));
  
        this.param.EmployeeId = data.userData.EmployeeId;
        this.param.token = data.userData.token;
        this.param.FullName = data.userData.FullName;
        this.simpanload = true;

        this.connect.postData(this.param, "createLembur").then((result) =>{
          this.responseData = result;
  
          if(this.responseData.success){
            this.param = {
              "token": data.userData.token,
              "EmployeeId": data.userData.EmployeeId,
              "Date": "",
              "StartOver":"",
              "EndOver":"",
              "Note":"",
              "FullName":""
            };
            this.viewCtrl.dismiss(this.responseData.success);
            //this.events.publish('addLembur', 1);
          }else{
            this.simpanload = false;
            this.presentToast(this.responseData.error.text);    
          }
        }, (err) => {
          this.simpanload = false;
          this.presentToast("Koneksi Bermasalah");
        });
      }

    }else{
      this.simpanload = false;
      this.presentToast("Isi data yang kosong !");
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
