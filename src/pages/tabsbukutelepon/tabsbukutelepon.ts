import { Component, ViewChild } from '@angular/core';
import { 
  NavController, 
  NavParams, 
  ToastController, 
  LoadingController, 
  Platform, 
  ViewController,
  Navbar
} from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';

@Component({
  selector: 'page-tabsbukutelepon',
  templateUrl: 'tabsbukutelepon.html',
})
export class TabsbukuteleponPage {

  @ViewChild(Navbar) navBar:Navbar;

	items: any;
  totalitems : Number = 0;
	responseData: any;
  param= {
    "token":"",
    "EmployeeId":"",
    "menu":"",
    "start": 0,
    "end": 0
  };

  public unregisterBackButtonAction: any;

  constructor(
  	public navCtrl: NavController, 
  	public connect: ConnectProvider,
    public viewCtrl: ViewController,
    public platform:Platform,
  	public toastController: ToastController,
  	public loadingCtrl: LoadingController,
  	public navParams: NavParams) {
  	this.inIt();
  }

  call(number){
  	if (number != "") {
  		setTimeout(() => {
	      window.open(`tel:${number}`, '_system');
	    },100);
  	}
  }

  ionViewDidLoad(){
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.viewCtrl.dismiss({},"",{
        animate: true,
        animation: 'ios-transition'
      });
    };
  }

  inIt(){
  	let loadingPopup = this.loadingCtrl.create({
      content: 'Loading data...'
    });

  	const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.start = 0;
  	this.param.end = 10;
    this.param.menu = "listbukutelepon";

  	loadingPopup.present();
    this.connect.postData(this.param, "getListUser").then((result) =>{
      this.responseData = result;

      if(this.responseData.dataUser){
      	loadingPopup.dismiss();
        this.items = this.responseData.dataUser;
        this.totalitems = this.responseData.totalUser;
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
        
      	this.connect.postData(this.param, "getListUser").then((result) => {
		  		this.responseData = result;
		  		
		  		if (this.responseData.dataUser) {
		  			for (let i = 0; i < this.responseData.dataUser.length; i++) {
				         const data = this.responseData.dataUser[i];
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

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.customHandleBackButton();
    }, 10);
  }

  private customHandleBackButton(): void {
    this.viewCtrl.dismiss({},"",{
      animate: true,
      animation: 'ios-transition'
    });
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
