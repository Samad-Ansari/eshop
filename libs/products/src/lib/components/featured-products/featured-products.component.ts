import { Component, OnInit, OnDestroy} from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'products-featured-item',
  templateUrl: './featured-products.component.html',
  styles: [
  ]
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  endswith$: Subject<any> = new Subject();

  constructor(private prodService: ProductsService) { }

  ngOnInit(): void {
  	this._getFeaturedProducts();
  }

  ngOnDestroy(){
  	this.endswith$.next(null);
  	this.endswith$.complete();
  }

  private _getFeaturedProducts(){
  	this.prodService.getFeaturedProducts(4).pipe(takeUntil(this.endswith$)).subscribe((products: any) => {
  		this.featuredProducts = products.products;
  	})
  }

}
