import { Component, ElementRef, Renderer } from '@angular/core';
import { 
    NavController, 
    NavParams, 
    ViewController, 
    Platform, 
    ToastController, 
    LoadingController, 
    MenuController,
    Events} from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the OrderdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderdetail',
  templateUrl: 'orderdetail.html',
})
export class OrderdetailPage {

  public unregisterBackButtonAction: any;

  page:any;
	param:any;
	swipeData: any;
	label: any;
	buttonleft : boolean = true;
	buttonright : boolean = true;
	buttonrightdisabled : boolean = false;
	buttonleftdisabled : boolean = false;
  rightload : boolean = false;
  leftload : boolean = false;
  responseData: any;
  carData: any;
  OccupationCode: string;

  constructor(
  	public navCtrl: NavController, 
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
  	public element: ElementRef, 
  	public renderer: Renderer,
    public events: Events,
    public connect: ConnectProvider,
    public platform: Platform,
    public toastController: ToastController,
    public menu: MenuController,
  	public navParams: NavParams) {
  	this.inIt();
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.menu.enable(true);
  }

  inIt(){
    this.menu.enable(false);
  	this.param = this.navParams.get('param');
    this.carData = this.navParams.get('carData');
    this.page = this.navParams.get('page');
    this.OccupationCode = this.navParams.get('OccupationCode');
    console.log(this.param);
  }

  swipedSelesai(e){
    switch (e.offsetDirection) {
      case 2: this.swipeData = "right to left"; break;
      case 4: this.swipeData = "left to right"; break;
      default: this.swipeData = "magic"; break;
    }
    if (this.swipeData == "left to right"){
      this.buttonleft = false;
    	this.buttonrightdisabled = true;
    	this.label = this.element.nativeElement.getElementsByClassName('labeltext')[1];
      this.renderer.setElementStyle(this.label,'opacity','.4');
      
      const data = JSON.parse(localStorage.getItem('userData'));
    
      this.param.EmployeeId = data.userData.EmployeeId;
      this.param.token = data.userData.token;
      this.param.OccupationCode = data.userData.OccupationCode;
      
      this.rightload = true;
      this.connect.postData(this.param, "completedOrder").then((result) =>{
        this.responseData = result;

        if(this.responseData.success){
          this.viewCtrl.dismiss(this.responseData);
          this.events.publish('removeNotif', 1);
          this.events.publish('changeStatus', 0);
          this.menu.enable(true);
        }else{
          this.presentToast(this.responseData.error.text);    
        }
      }, (err) => {
        this.presentToast("Koneksi Bermasalah");
      });
    }
  }

  swiped(e) {
    switch (e.offsetDirection) {
      case 2: this.swipeData = "right to left"; break;
      case 4: this.swipeData = "left to right"; break;
      default: this.swipeData = "magic"; break;
    }
    if (this.swipeData == "right to left") {
    	this.buttonright = false;
    	this.buttonleftdisabled = true;
    	this.label = this.element.nativeElement.getElementsByClassName('labeltext')[0];
    	this.renderer.setElementStyle(this.label,'opacity','.4');

      const data = JSON.parse(localStorage.getItem('userData'));
      this.param.StatusOrder = 2;
    
      this.param.EmployeeId = data.userData.EmployeeId;
      this.param.token = data.userData.token;
      this.param.OccupationCode = data.userData.OccupationCode;
      
      this.leftload = true;
      this.connect.postData(this.param, "updateOrder").then((result) =>{
        this.responseData = result;
        if(this.responseData.success){
          this.viewCtrl.dismiss(this.responseData);
          this.events.publish('removeNotif', 1);
          this.menu.enable(true);
        }else{
          this.presentToast(this.responseData.error.text);    
        }
      }, (err) => {
        this.presentToast("Koneksi Bermasalah");
      });
    }else{
    	this.buttonleft = false;
    	this.buttonrightdisabled = true;
    	this.label = this.element.nativeElement.getElementsByClassName('labeltext')[1];
    	this.renderer.setElementStyle(this.label,'opacity','.4');

      const data = JSON.parse(localStorage.getItem('userData'));
      this.param.StatusOrder = 1;
    
      this.param.EmployeeId = data.userData.EmployeeId;
      this.param.token = data.userData.token;
      this.param.OccupationCode = data.userData.OccupationCode;
      
      this.rightload = true;
      this.connect.postData(this.param, "updateOrder").then((result) =>{
        this.responseData = result;

        if(this.responseData.success){
          this.viewCtrl.dismiss(this.responseData);
          this.events.publish('changeStatus', 1);
          this.menu.enable(true);
        }else{
          this.presentToast(this.responseData.error.text);    
        }
      }, (err) => {
        this.presentToast("Koneksi Bermasalah");
      });
    }
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
    this.viewCtrl.dismiss();
    this.menu.enable(true);
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
