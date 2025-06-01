import { Component, OnInit } from '@angular/core';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { Course } from "../../models/course.model";
import { AuthenticationService } from "../../services/authentication.service";
import { CourseService } from "../../services/course.service";
import { PurchaseService } from "../../services/purchase.service";
import { Purchase } from "../../models/purchase.model";
import { RazorpayService } from "../../services/razorpay.service";
declare var Razorpay: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courseList: Array<Course> = [];
  faUserGraduate = faUserGraduate;
  errorMessage: string = "";
  infoMessage: string = "";

  constructor(
    private authenticationService: AuthenticationService,
    private courseService: CourseService,
    private purchaseService: PurchaseService,
    private razorpayService: RazorpayService
  ) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe(data => {
      this.courseList = data;
    });
  }

  purchase(course: Course) {
    const user = this.authenticationService.currentUserValue;

    if (!user?.id) {
      this.errorMessage = 'You should login to buy a course';
      return;
    }

    // 1. Create Razorpay order via backend
    this.razorpayService.createPayment(course.price).subscribe((order: any) => {
      const options = {
        key: 'rzp_test_62PkGMZ4214nuj', // Replace with your actual Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Online Course Seller',
        description: course.title,
        order_id: order.id,
        handler: (response: any) => {
          // 2. On payment success, call backend to save purchase
          const purchase = new Purchase(
            user.id,
            course.id,
            course.title,
            course.price
          );

          this.purchaseService
            .confirmPaymentSuccess(
              purchase,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            )
            .subscribe(() => {
              this.infoMessage = 'Purchase successful!';
            });
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
}


