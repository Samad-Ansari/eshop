import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { OrderItem } from '../../models/order-item';
import { Order } from '../../models/order';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { ORDER_STATUS } from '../../order.constant';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private messageService: MessageService
  ) {}
  checkoutFormGroup: any;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId: string = '62e120c626f6a0d339e29008';
  countries: any = [];

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._getCountries();
  }

  private _getCartItems(){
  	const cart: Cart = this.cartService.getCart();
  	this.orderItems = cart.items?.map(item => {
  		return {
  			product: item.productId,
  			quantity: JSON.stringify(item.quantity)
  		}
  	}) || [{}];

  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order:Order = {
		orderItems: this.orderItems,
		shippingAddress1: this.checkoutForm.street.value,
		shippingAddress2: this.checkoutForm.apartment.value,
		city: this.checkoutForm.city.value,
		zip: this.checkoutForm.zip.value,
		status: 0,
		country: this.checkoutForm.country.value,
		phone: this.checkoutForm.phone.value,
		user: this.userId,
		dateOrdered: `${Date.now()}`
    }
    this.ordersService.createOrder(order).subscribe(() => {
    	//redirect to thankyou page
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Order Placed Successfully'});
 
      this.cartService.emptyCart();
      this.router.navigate(['/success']);
    }, (error) => {
      // error
      this.messageService.add({severity:'error', summary: 'Error', detail: error.error.message});
    })
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
