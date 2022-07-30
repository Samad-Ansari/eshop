import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService, CartItem } from '@bluebits/orders'

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product: Product = {};
  endswith$: Subject<any> = new Subject();
  quantity: number = 1;
  constructor(private prodService: ProductsService, 
    private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
  	this.route.params.subscribe((params: any) => {
  		if(params.productid){
  			this._getProduct(params.productid);
  		}
  	})
  }

  ngOnDestroy(){
  	this.endswith$.next(null);
  	this.endswith$.complete();
  }

  private _getProduct(id: string){
  	this.prodService.getProduct(id).pipe(takeUntil(this.endswith$)).subscribe((product) => {
  		this.product = product;
  	})
  }

  addProductToCart(){
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }

    this.cartService.setCartItem(cartItem);
  }

}
