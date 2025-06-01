import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../models/purchase.model";
import {Observable} from "rxjs";

const API_URL = environment.BASE_URL + '/gateway/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }
  
  savePurchase(purchase: Purchase): Observable<any> {
    return this.http.post(API_URL, purchase, {headers: this.getHeaders});
  }

  getAllPurchaseItems(): Observable<any> {
    return this.http.get(API_URL, {headers: this.getHeaders});
  }

  confirmPaymentSuccess(
  purchase: Purchase,
  paymentId: string,
  orderId: string,
  signature: string
): Observable<any> {
  const formData = new FormData();
  formData.append('userId', (purchase.userId ?? '').toString());
  formData.append('courseId', (purchase.courseId ?? '').toString());
  formData.append('title', purchase.title ?? '');
  formData.append('price', (purchase.price ?? '').toString());
  formData.append('razorpayPaymentId', paymentId);
  formData.append('razorpayOrderId', orderId);
  formData.append('razorpaySignature', signature);

  return this.http.post(`${API_URL}/payment-success`, formData, {
    headers: this.getAuthHeaderOnly
  });
}

}
