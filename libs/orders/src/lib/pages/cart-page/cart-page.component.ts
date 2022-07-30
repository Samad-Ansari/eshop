import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { CartItemDetailed } from '../../models/cart';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {MessageService} from 'primeng/api';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {
  
  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount : number= 0;
  endswith$: Subject<any> = new Subject();

  constructor(private router: Router, 
  	private cartService: CartService,
  	private ordersService: OrdersService,
    private messageService: MessageService) { }

  backToShop(){
  	this.router.navigate(['/products']);
  }

  deleteCartItem(cartItem: CartItemDetailed){
  	this.cartService.deleteCartItem(cartItem.product.id);
  }

  ngOnInit(): void {
  	this._getCartDetails();
  }

  ngOnDestroy(){
  	this.endswith$.next(null);
  	this.endswith$.complete();
  }

  private _getCartDetails(){
  	this.cartService.cart$.pipe(takeUntil(this.endswith$)).subscribe((respCart : any) => {
  		this.cartItemsDetailed = [];
  		this.cartCount = respCart?.items.length;
  		respCart.items.forEach((cartItem: any) => {
  			this.ordersService.getProduct(cartItem.productId).subscribe((resProduct: any) => {
  				this.cartItemsDetailed.push({
  					product: resProduct,
  					quantity: cartItem.quantity
  				})
  			})
  		})
  	})
  	console.log(this.cartItemsDetailed);
  }

  updateCartItemQuantity(event: any, cartItem: CartItemDetailed){
    this.cartService.setCartItem({
      productId: cartItem.product.id,
      quantity: event.value
    }, true)

    this.messageService.add({severity:'success', summary: 'Success', detail: 'Cart Updated'});
   
  }

}
