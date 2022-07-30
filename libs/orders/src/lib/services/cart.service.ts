import { Injectable } from '@angular/core';
import { CartItem, Cart } from '../models/cart';
import { BehaviorSubject } from 'rxjs';

export const CART_KEY: string = "cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.getCart());

  constructor() { }

  initCartLocalStorage(){
  	const cart: Cart = this.getCart();
  	if(!cart){
	  	const initialCart = {
	  		items: []
	  	}
	  	const initialCartJson =  JSON.stringify(initialCart);
	  	localStorage.setItem(CART_KEY, initialCartJson);
    } else {
      this.cart$.next(cart);
    }
  }

  getCart(): Cart {
  	const cartJsonString : string =  localStorage.getItem(CART_KEY)!;
  	const cart: Cart = JSON.parse(cartJsonString);
  	return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean){
  	const cart: any = this.getCart();
  	const cartItemExist = cart.items.find((item : any) => item.productId === cartItem.productId);
  	if(cartItemExist) {
  		cart.items.map((item: any) => {
  			if(item.productId === cartItem.productId){
          if(updateCartItem){
  				  item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity + cartItem.quantity;
          }
  				return item;
  			}
  		})
  	} else {
	  	cart.items.push(cartItem);
  	}
  	const cartJson =  JSON.stringify(cart);
  	localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
  	return cart;
  }

  deleteCartItem(productId: string) {
    const cart = this.getCart();
    const newCart = cart.items?.filter((item) => item.productId !== productId);

    cart.items = newCart;

    const cartJsonString =  JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);
    this.cart$.next(cart);
  }

  emptyCart() {
    const initialCart = {
        items: []
      }
      const initialCartJson =  JSON.stringify(initialCart);
      localStorage.setItem(CART_KEY, initialCartJson);

    this.cart$.next(initialCart);
  }
}
