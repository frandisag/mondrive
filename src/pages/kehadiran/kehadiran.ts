import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events} from 'ionic-angular';
import {
	  GoogleMaps,
	  GoogleMap,
	  GoogleMapsAnimation,
	  MyLocation
	} from '@ionic-native/google-maps';
import { ConnectProvider } from '../../providers/connect/connect';
import { Camera, CameraOptions } from "@ionic-native/camera";
/**
 * Generated class for the KehadiranPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-kehadiran',
  templateUrl: 'kehadiran.html',
})
export class KehadiranPage {

	map: GoogleMap;
  responseData: any;
  param= {
    "token":"",
    "EmployeeId":"",
    "CarBankId":"",
    "avatar":"",
    "kmterakhir":"",
    "lat": "",
    "lng": ""
  };
  cars: any;

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

  constructor(
  	public navCtrl: NavController, 
  	public toastController: ToastController,
    public connect: ConnectProvider,
    public events: Events,
    public camera: Camera,
  	public navParams: NavParams) {
    events.subscribe('getMylocation', (tabsIndex) => {
      this.map.clear();

      // Get the location of you
      this.map.getMyLocation()
      .then((location: MyLocation) => {
        this.param.lat = location.latLng.lat.toString();
        this.param.lng = location.latLng.lng.toString();
        // Move the map camera to the location with animation
        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        })
        .then(() => {
          this.map.addMarkerSync({
            title: 'Lokasi Saya',
            position: location.latLng,
            animation: GoogleMapsAnimation.BOUNCE
          });
        });
      });
    });
  	this.loadMap();
  }

  doRefresh(refresher){
    this.loadMap();
    refresher.complete();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas');
    this.map.getMyLocation()
    .then((location: MyLocation)=>{
      this.param.lat = location.latLng.lat.toString();
      this.param.lng = location.latLng.lng.toString();
      this.map.moveCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      }).then(()=>{
        this.map.addMarkerSync({
          title: 'Lokasi Saya',
          position: location.latLng,
          animation: GoogleMapsAnimation.BOUNCE,
          zoom: 17,
          tilt: 30
        });
      })  
    })
    .catch((e)=>{
      this.presentToast(e);
    })
    const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.CarBankId = data.userData.CarBankId;

    this.connect.postData(this.param, "getCars").then((result) =>{
      this.responseData = result;

      if(this.responseData.carData){
        this.cars = this.responseData.carData;
      }else{
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      this.presentToast("Koneksi Bermasalah");
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

  getPhoto() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((imageData)=>{
      this.param.avatar = "data:image/jpeg;base64," + imageData;
    },(err)=>{
      this.presentToast(err);
    });
  }

  simpan(){
    if (this.param.lng != "" && this.param.lat != "") {
      if (this.param.avatar != "" && this.param.CarBankId != "" && this.param.kmterakhir != "") {
        const data = JSON.parse(localStorage.getItem('userData'));
      
        this.param.EmployeeId = data.userData.EmployeeId;
        this.param.token = data.userData.token;
        if(!this.param.CarBankId){
          this.param.CarBankId = data.userData.CarBankId;
        }
        this.connect.postData(this.param, "acceptKehadiran").then((result) =>{
          this.responseData = result;

          if(this.responseData.success){
            this.param = {
              "token": data.userData.token,
              "EmployeeId": data.userData.EmployeeId,
              "CarBankId": data.userData.CarBankId,
              "avatar":"",
              "kmterakhir":"",
              "lat": "",
              "lng": ""
            };
            this.presentToast("Sukses Mengirim");
          }else{
            this.presentToast(this.responseData.error.text);    
          }
        }, (err) => {
          this.presentToast("Koneksi Bermasalah");
        });
      }else{
        this.presentToast("Isi data yang kosong !");
      }
    }else{
      this.presentToast("Tidak bisa mendapatkan lokasi.\nTarik kebawah untuk menyegarkan");
    }
  }
}
