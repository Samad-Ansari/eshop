import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orders-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  totalPrice : number = 0;
  isCheckout = false;
  endswith$: Subject<any> = new Subject();
  constructor(private cartService: CartService,
   private router: Router,
   private ordersService: OrdersService) {
    this.router.url.includes('checkout') ? this.isCheckout = true: this.isCheckout = false;
   }

  ngOnInit(): void {
  	this._getOrderSummary();
  }

  ngOnDestroy(){
  	this.endswith$.next(null);
  	this.endswith$.complete();
  }

  navigateToCheckout(){
    this.router.navigate(['/checkout']);
  }

  private _getOrderSummary() {
  	this.cartService.cart$.pipe(takeUntil(this.endswith$)).subscribe((cart) => {
  		this.totalPrice = 0;
  		if(cart) {
  			cart.items?.map((item: any) => {
  				this.ordersService
  				.getProduct(item.productId)
  				.pipe(take(1))
  				.subscribe((product: any) => {
  					this.totalPrice += product.price * item.quantity;
  				})
  			})
  		}

  	})
  }

}
