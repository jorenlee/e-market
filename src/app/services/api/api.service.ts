import { Category } from 'src/app/models/category.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Shop } from 'src/app/models/shop.model';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { Product } from 'src/app/models/product.model';
import { Address } from 'src/app/models/address.model';
import { Order } from 'src/app/models/order.model';
import {StorageService} from "../storage/storage.service";
import { environment } from "../../../environments/environment";
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import {AlertController, LoadingController, Platform, ToastController} from "@ionic/angular";
import { NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';

// import { NativeGeocoder } from '@capgo/nativegeocoder';


import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
// import { HttpClient } from '@angular/common/http';
import {Geolocation} from "@capacitor/geolocation";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  config: any = environment.firebase;
  firestore: any = firebase.firestore();
  
  categories: Category[] = [];
  
  allItems: Product[] = [];
  shops: Shop[] = [];
  allshops: Shop[] = [];
  shops1: Shop[] = [];
  addresses: Address[] = [];
  orders: Order[] = [];
  email: string = "";
  name: string="";

  // Merge
  appname: any = environment.appname;
  static email: string = "";
  static role: string = "";
  token:any={};
  static usertype: any;
  keys:any[]=[];
  obj:any = {};
  base64:any;
  shop:any;


  constructor(
    private adb: AngularFirestore,
    private storageService:StorageService,
    private http:HTTP,
    private platform:Platform,
    private storage:Storage,
    private loader:LoadingController,
    private toast:ToastController,
    private router:Router,
    private location:Location,
    private geocoder:NativeGeocoder,
    private alertCtrl:AlertController,
    private api: ApiService,

  ){
   
     this.platform.ready().then(()=>{

     
      if (firebase.apps.length == 0) {
        firebase.initializeApp(this.config);

      }
    })
    
  }

  collection(path, queryFn?){
    return this.adb.collection(path, queryFn);
  }


  // function to get banners
  async addBanner(data) {
    try {
      const id = this.randomString();
      data.id = id;
      await this.collection('banners').doc(id).set(data);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }
  // New unique string will be created for the banners
  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  async getBanners() {
    try {
      const banners = await this.collection('banners').get().pipe(
        switchMap(async(data: any) => {
          let bannerData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(bannerData);
          return bannerData;
        })
        // Making it promise so that I will get the data not observable
      ).toPromise();
      console.log(banners);
      return banners;
    } catch(e) {
      throw(e);
    }
  }
  // creating shop in sellerpage
  async addShop(data) {
    console.log(data);
    try {
      // creating shop
      const id = this.randomString();
      
      const shop = new Shop(
        id,
        data.cover,
        data.name,
        data.email,
        data.phone,
        data.shop_name,
        // (data.shop_name).toLowerCase(),
        // data.short_name,
        data.description,
        data.pickup_address,
        // data.shopcategory,
        // this.firestore.collection('All Shops').doc(id)
        // data.status,
        // const result = await this.collection('product item').doc(id).collection('Item').doc(id).set(productData);
      );
      let shopData = Object.assign({}, shop);
      console.log(shopData);
      
     // const result = await this.collection('Shops').doc(id).set(shopData);
      // const result = await this.collection('Shops').doc(id).collection('Shop Items').doc(id).set(shopData);
      const result = await this.collection('Shops').doc(id).set(shopData);
      console.log(result)
      this.addCategories(this.categories, data.id);
      return true;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

     // products
     async addProduct(data) {
      try {
        const id = this.randomString();
        const product = new Product(
          id,
          data.shop_id,
          this.firestore.collection('categories').doc(data.category_id),
          data.cover,
          data.product_name,
          data.description,
          data.price,
          data.status,
          // false,
          0,
        );
        let productData = Object.assign({}, product);
        delete productData.quantity;
        console.log(productData);
        const result = await this.collection('product item').doc(data.shop_id).collection('Shop Items').doc(id).set(productData);
        // const result = await this.collection('product item').doc(id).set(productData);
        return true;
      } catch(e) {
        throw(e);
      }
    }



  // gettings shops to homepage
  // fetching products from shops
  async getEMarket() {
    try {
      const emarket = await this.collection('Shops').get().pipe(
        switchMap(async(data: any) => {
          let emarketData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(emarketData);
          return emarketData;
        })
        // Making it promise so that I will get the data not observable
      ).toPromise();
      console.log(emarket);
      return emarket;
    } catch(e) {
      throw(e);
    }
  }

  async getShopsById(id): Promise<any> {
    try {
      const getshopid = (await (this.collection('Shops').doc(id).get().toPromise())).data();
      console.log(getshopid);
      return getshopid;
    } catch(e){
      throw(e);
    }
  }

  // shop categories
  async getShopCategories(uid) {
    try {
      const categories = await this.collection(
        'categories',
        ref => ref.where('uid', '==', uid)
      ).get().pipe(
        switchMap(async(data: any) => {
          let categoryData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(categoryData);
          return categoryData;
        })
      ).toPromise();
      console.log(categories);
      return categories;
    } catch(e) {
      throw(e);
    }
  }

  async addCategories(categories, uid) {
    try {
      categories.forEach(async(element) => {
        const id = this.randomString();
        const data = new Category(
          id,
          element,
          uid
        );
        const result = await this.collection('categories').doc(id).set(Object.assign({}, data));        
      });
      return true;
    } catch(e) {
      throw(e);
    }
  }

  //getting shop products uid
  async getShopProducts(uid) {
    try {
      const itemsRef = await this.collection('product item').doc(uid)
          .collection('Shop Items', ref => ref.where('status', '==', true));
      const items = itemsRef.get().pipe(
        switchMap(async(data: any) => {
          let productData = await data.docs.map(element => {
            let item = element.data();
            // item.category_id.get()
            // .then(cData => {
            //   item.category_id = cData.data();
            // })
            // .catch(e => { throw(e); });
            return item;
          });
          console.log(productData);
          return productData;
        })
      )
      .toPromise();
      console.log(items);
      return items;
    } catch(e) {
      throw(e);
    }
  }
  
insertTokens(email,token)
{

  const id = this.randomString();
 // email.replace(/[^\w\s]/gi, '')
 let obj = {};
 obj[token] = "token";
 
 firebase.database().ref('fcms/'+email.replace(/[^\w\s]/gi, '')).set(obj).then((res)=>{
  },(err)=>{
    alert(JSON.stringify(err));
  });
}

getTokens(email)
{
  firebase.database().ref("fcms/" + email.replace(/[^\w\s]/gi, '') + "/").once('value').then((snapshot) => {
   var obj = snapshot.val();
   
   if(obj)
   {
    let tokens = Object.keys(obj);
    this.fcmSend(tokens)
   }
});
}

fcmSend(tokens)
  {
    this.storageService.getStorage("profile").then((res:any)=>{
      alert(res.value);
      let res1 = JSON.parse(res.value);
      this.email = res1.email;
      this.name = res1.name;
   alert(this.name);
    //var tokens  = ["f4GsHg8VMWM:APA91bExA7cdu-RqLuvXLRbGFuLaeNc_hD9HWN0m5mc8bGhLLlWAk-wgIs9sl9aSI337aT5o5dH7I266qjozUSEYz25lBktG5p3JSSBsNYUCE5aUFceJ6Zz0vkDrxBxxkiP-3hjM_nRd"];
    
    
    var obj = {};
    
    // for(var i = 0;i<this.datas.length;i++)
    // {
    //   obj[this.datas["key"]] = this.datas["value"];
    // }
    
    var message = {
      registration_ids:tokens,
      data: obj,
      notification:{
       
        sound:"default",
        title : "New Order!",
        body : "New order placed by "+this.name+", tap to see",
     
      
        color:"#FFCB2E",
       
        vibrate:true

       
      },
      
      apns:{
        payload:{
          aps:{
            mutable_content:1
          }
          
        },
       
      },
     
    };
   
    var url = "https://fcm.googleapis.com/fcm/send";
    var header= {"Authorization":"key="+this.config.serverKey,"Sender":"id="+this.config.senderId,"Content-Type":"application/json"};
    this.http.setDataSerializer("json");
    
    this.http.post(url,message,header).then((data)=>{

      var objtemp = JSON.parse(data.data)
      
      // objtemp.success = "522";
      // objtemp.failure = (this.tokens.length - parseInt(objtemp.success)).toString();

     
    },(err)=>{
    
      alert(JSON.stringify(err));
    })
  
    })
    // WebRequest tRequest = WebRequest.Create("https://fcm.googleapis.com/fcm/send");
    // tRequest.Method = "post";
    // //serverKey - Key from Firebase cloud messaging server  
    // tRequest.Headers.Add(string.Format("Authorization: key={0}", serverkey));
    // //Sender Id - From firebase project setting  
    // tRequest.Headers.Add(string.Format("Sender: id={0}", senderid));
    
  }


  // Merge
  getToken()
  {

      return new Promise((resolve,response)=>{


       this.storage.get("token").then((token) => {
        resolve(token);
      })
    })
  }

  setToken()
  {
    return new Promise((resolve,response)=>{


     this.storage.get("token").then((token) => {
        if(token)
        {
          console.log(token);
        this.token = token;
        ApiService.email = token.email;
        ApiService.usertype = token.type;
        resolve("");
        }
        else{
          resolve("");
        }
      })
    })
  }

  //shop insertion , deletion ,updation

  manageShops(obj:any,  key:any, fn:any) {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.AddressToGps(obj.location).then((res:any)=>{

       let arr = res.split(',');
       obj.lat = arr[0];
       obj.lng = arr[1];

      firebase.database().ref(this.appname + "/shops/" + ApiService.email.replace(/[^\w\s]/gi, '') + "/" + key).set(obj).then(() => {
        ele.dismiss();


        fn("ok");


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    },(err)=>{
      ele.dismiss();
      this.showToast(JSON.stringify(err));
    })
    })
   }

   //getting shop details
   getShops(fn:any)
   {
     this.loader.create({
       message:"please wait..."
     }).then((ele)=>{
       ele.present();
       this.setToken().then(()=>{

       if(ApiService.usertype == "admin")
       {
     ApiService.email = ApiService.email.replace(/[^a-zA-Z0-9 ]/g, '');
     firebase.database().ref(this.appname + "/shops/"+ApiService.email).once('value').then((snapshot1) => {
       ele.dismiss();
       fn(snapshot1.val());
     },(err)=>{
       console.log(err);
       fn(err);
      ele.dismiss();
    })
  }
  else{
    firebase.database().ref(this.appname + "/shops/").once('value').then((snapshot1) => {
      ele.dismiss();
      fn(snapshot1.val());
    },(err)=>{
      console.log(err);
      fn(err);
     ele.dismiss();
   })
  }
  })
   })
   }

   //product insertion ,product edit,product remove

   manageProduct(obj:any,shopid:any,  key:any, fn:any) {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      firebase.database().ref(this.appname + "/shops/" + ApiService.email.replace(/[^\w\s]/gi, '') + "/" + shopid+"/products/"+key).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
    })
   }

   //getting single product
   getSingleProduct(proId:any,shopId:any,fn:any)
   {
    // this.loader.create({
    //   message:"please wait..."
    // }).then((ele)=>{
    //   ele.present();
    this.setToken().then(()=>{
    ApiService.email = ApiService.email.replace(/[^a-zA-Z0-9 ]/g, '');
    firebase.database().ref(this.appname + "/shops/"+ApiService.email+"/"+shopId+"/products/"+proId).once('value').then((snapshot1) => {
      //ele.dismiss();
      fn(snapshot1.val());
    },(err)=>{
      console.log(err);
      fn(err);
    // ele.dismiss();
   })
  })
  //})
   }

   //get orders
   getOrders(fn:any)
   {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      ApiService.email = ApiService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/orders/").once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
    })
   }
   //manage orders

   manageOrders(obj:any,id:any,fn:any)
   {
     this.loader.create({
       message: "please wait..."
     }).then((ele) => {
 
       ele.present();

       this.setToken().then(()=>{
        obj["useremail"] = ApiService.email.replace(/[^\w\s]/gi, '');
        Geolocation.getCurrentPosition().then((position)=>{

        obj["userlat"] = position.coords.latitude.toString();
        obj["userlng"] = position.coords.longitude.toString();
       firebase.database().ref(this.appname + "/orders/"  + id).set(obj).then(() => {
         ele.dismiss();
 
 
         fn("ok");
         
 
 
       }, (err) => {
         ele.dismiss();
         this.showToast(JSON.stringify(err));
 
       })
      },(err)=>{
        this.showToast(JSON.stringify(err));
      })
     })
     })
   }

   //modify status of order
   modifyStatusOfOrder(id:any,status:any,fn:any)
   {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();

      this.setToken().then(()=>{
       
      firebase.database().ref(this.appname + "/orders/"  + id+"/status/").set(status).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
    })
   }
   //assign rider
   assignRider(riderEmail:any,orderId:any,fn:any)
   {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
        // obj["adminemail"] = ApisService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/users/" + riderEmail+"/orderId").set(orderId).then(() => {
        firebase.database().ref(this.appname + "/orders/" + orderId+"/rideremail").set(riderEmail).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    }, (err) => {
      ele.dismiss();
      this.showToast(JSON.stringify(err));

    })
    })
    })
   }

   //getting riders

  getRiders(fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
      ApiService.email = ApiService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/users/").once('value').then((snapshot1) => {
        ele.dismiss();
        fn(snapshot1.val());
      },(err)=>{
        console.log(err);
        fn(err);
       ele.dismiss();
     })
    })
    })
  }
  //manage riders
  manageRider(obj:any,id:any,fn:any)
  {
    this.loader.create({
      message: "please wait..."
    }).then((ele) => {

      ele.present();
      this.setToken().then(()=>{
        obj["adminemail"] = ApiService.email.replace(/[^a-zA-Z0-9 ]/g, '');
      firebase.database().ref(this.appname + "/users/" + obj.email.replace(/[^\w\s]/gi, '')).set(obj).then(() => {
        ele.dismiss();


        fn("ok");
        


      }, (err) => {
        ele.dismiss();
        this.showToast(JSON.stringify(err));

      })
    })
    })
  }


  // Getting gps

   AddressToGps(address:string)
  {
    return new Promise((resolve,error)=>{


    this.geocoder.forwardGeocode(address).then((res:NativeGeocoderResult[])=>{
        if(res)
        {
           resolve(res[0].latitude.toString()+","+res[0].longitude.toString())
        }
        else{
error("unable to get gps");
        }
    },(err)=>{
error(err);
    })
  })
  }

  showToast(msg:any) {

    this.toast.create({
      message: msg,
      duration: 3000,



    }).then((ele) => {
      ele.present();
    })
  }
  
  upload(base64:any, fileName:any, fn:any) {
    let ref = this;
    this.loader.create({
      message: "uploading file..."
    }).then((ele) => {

      ele.present();

      // window.app.firebasetemp.database().ref(window.app.appName+"/images/"+id+"/").set(obj, function (err) {

      //   ele.dismiss();
      // })
      var storageref = firebase.storage().ref();

      var childRef = storageref.child(fileName);
      childRef.putString(base64, "data_url").then((snapshot) => {
        ele.dismiss();
        snapshot.ref.getDownloadURL().then((downloadURL) => {

          fn(downloadURL)
        }, (err) => {
          ele.dismiss();
          console.log(err);
        });
      }, (err) => {
        ele.dismiss();
        console.log(err);
      })


    })
  }

  goto(url:any,data ? :any)
  {
    if(data)
    {
      let navigationExtras: NavigationExtras = {
        queryParams: {
           data: JSON.stringify(data),

        }
    };
this.router.navigate([url],navigationExtras);
    }
    else{
      this.router.navigate([url]);
    }
  }

  back()
  {
    this.location.back();
  }

  showAlert(msg:string)
  {
   this.alertCtrl.create({
    message:msg,
    backdropDismiss:false,
    buttons:[{
      text:"ok"
    }]
   }).then((ele)=>{
    ele.present();
   })
  }

  

}
