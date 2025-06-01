import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  private baseUrl = environment.BASE_URL + '/gateway/purchase';

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  createPayment(amount: number) {
    return this.http.post(`${this.baseUrl}/create-payment?amount=${amount}`, {}, {
      headers: {
        'Authorization': `Bearer ${this.auth.currentUserValue.token}`
      }
    });
  }
}
