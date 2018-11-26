import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, Platform, LoadingController, Events } from 'ionic-angular';
import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the OrderbuatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderbuat',
  templateUrl: 'orderbuat.html',
})
export class OrderbuatPage {

  public unregisterBackButtonAction: any;
  simpanload: boolean = false;
	items: any;
  responseData: any;
  cars:any;
  employees:any;
  isEnabled: boolean = false;
  param= {
    "token":"",
    "EmployeeId":"",
    "OrderBy":"",
    "CarBankId":"",
    "dari":"",
    "tujuan":"",
    "NamaPenumpang":"",
    "menu":"",
    "Catatan":"",
    "status":"",
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
  	this.inIt();
  }

  inIt(){
  	let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });

  	const data = JSON.parse(localStorage.getItem('userData'));
        
    this.param.EmployeeId = data.userData.EmployeeId;
    if (data.userData.OccupationCode != 'GA') this.param.OrderBy = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.CarBankId = data.userData.CarBankId;
  	this.param.menu = "orderbuat";

  	if (data.userData.OccupationCode == "DRV") {
  		this.isEnabled = true;
  	}

  	loadingPopup.present();
    this.connect.postData(this.param, "getListUser").then((result) =>{
      this.responseData = result;

      if(this.responseData.dataUser){
      	loadingPopup.dismiss();
        this.employees = this.responseData.dataUser;
        this.cars = this.responseData.carData;
      }else{
      	loadingPopup.dismiss();
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
    	loadingPopup.dismiss();
      this.presentToast("Koneksi Bermasalah");
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  simpan(){
  	if (
      this.param.OrderBy != "" 
      && this.param.CarBankId != "" 
      && this.param.dari != "" 
      && this.param.tujuan != "" 
      && this.param.NamaPenumpang != "") {
      const data = JSON.parse(localStorage.getItem('userData'));
    
      this.param.EmployeeId = data.userData.EmployeeId;
      this.param.token = data.userData.token;
      this.param.FullName = data.userData.FullName;
      
      this.simpanload = true;
      this.connect.postData(this.param, "createOrder").then((result) =>{
        this.responseData = result;

        if(this.responseData.success){
          this.param = {
            "token": data.userData.token,
            "EmployeeId": data.userData.EmployeeId,
            "CarBankId": data.userData.CarBankId,
            "OrderBy": data.userData.EmployeeId,
            "dari":"",
				    "tujuan":"",
				    "NamaPenumpang":"",
				    "menu":"",
				    "Catatan":"",
				    "status":"",
            "FullName":""
          };
          this.viewCtrl.dismiss(this.responseData.success);
          this.events.publish('addNotif', 1);
        }else{
          this.simpanload = false;
          this.presentToast(this.responseData.error.text);    
        }
      }, (err) => {
        this.simpanload = false;
        this.presentToast("Koneksi Bermasalah");
      });
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
