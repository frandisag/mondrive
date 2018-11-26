import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { OrderbuatPage } from '../orderbuat/orderbuat';
import { OrderdetailPage } from '../orderdetail/orderdetail';

import { ConnectProvider } from '../../providers/connect/connect';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

	items: any;
  nodata: boolean = false;
  carData: any;
	totalitems : Number = 0;
  responseData: any;
  color: any;
  param= {
    "token":"",
    "EmployeeId":"",
    "startdate":"",
    "enddate":"",
    "OccupationCode":"",
    "start": 0,
    "end": 0
  };

  constructor(
  	public navCtrl: NavController, 
  	public modalCtrl:ModalController,
  	public toastController: ToastController,
    public loadingCtrl: LoadingController,
  	public connect: ConnectProvider,
  	public navParams: NavParams) {
  	this.inIt();
  }

  inIt(){
  	const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.OccupationCode = data.userData.OccupationCode;
    this.param.startdate = "";
    this.param.enddate = "";
    this.param.start = 0;
    this.param.end = 10;

    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });
    loadingPopup.present();
    this.connect.postData(this.param, "getListOrderDev").then((result) =>{
      this.responseData = result;

      if(this.responseData.dataOrder){
        this.items = this.responseData.dataOrder;
        console.log(this.items.length);
        if (this.items.length > 0) {
          this.nodata = false
        }else{
          this.nodata = true
        }
        this.totalitems = this.responseData.totalOrder;
        this.carData = this.responseData.carData;
        loadingPopup.dismiss();
      }else{
        loadingPopup.dismiss();
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      loadingPopup.dismiss();
      this.presentToast("Koneksi Bermasalah");
    });
  } 

  doRefresh(refresher){
    this.inIt();
    refresher.complete();
  }

  doInfinite(): Promise<any> {
    const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.start = this.param.end;
    this.param.end = this.param.end + 10 ;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.connect.postData(this.param, "getListOrderDev").then((result) => {
          this.responseData = result;
          
          if (this.responseData.dataOrder) {
            for (let i = 0; i < this.responseData.dataOrder.length; i++) {
							const data = this.responseData.dataOrder[i];
							this.items.push(data);
            }
          }else{
            this.presentToast(this.responseData.error.text);
          }
        },(err)=>{
          this.presentToast("Connection Problem");
        }) 
        
        resolve();
      }, 500);
    })
  }

  opendetail(item,carData){
    const data = JSON.parse(localStorage.getItem('userData'));

  	let profileModal = this.modalCtrl.create(OrderdetailPage,{
      param: item,
      carData: carData,
      page: 'order',
      OccupationCode: data.userData.OccupationCode    
    });
    profileModal.onDidDismiss(data => {
      if (data) {
        this.inIt();
      }
    });
    profileModal.present();
  }

  addOrder(){
    let profileModal = this.modalCtrl.create(OrderbuatPage,{
      startdate: this.param.startdate,
      enddate: this.param.enddate
    });
    profileModal.onDidDismiss(data => {
      if (data) {
      	this.inIt();
      }
    });
    profileModal.present();
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
}
