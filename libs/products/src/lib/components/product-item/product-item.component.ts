import { Component, OnInit, Input} from '@angular/core';
import { Product } from '../../models/product';
import { CartService, CartItem } from '@bluebits/orders';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product = {}; 

  constructor(private cartService: CartService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  addProductToCart(){
  	const cartItem: CartItem = {
  		productId: this.product.id,
  		quantity: 1
  	}
  	this.cartService.setCartItem(cartItem)
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Added to Cart'});
   
  }

}
