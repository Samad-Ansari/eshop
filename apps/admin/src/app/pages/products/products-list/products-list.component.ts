import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService, Product } from '@bluebits/products';
import { Router } from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endswith$ : Subject<any> = new Subject();
  constructor(
    private productsService: ProductsService, 
    private router: Router, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._getProducts();
  }

  ngOnDestroy() {
    this.endswith$.next(null);
    this.endswith$.complete();
  }

   private _getProducts() {
     this.productsService.getProducts().pipe(takeUntil(this.endswith$)).subscribe((products) => {
       this.products = products;
     })
   }

   updateProduct(productId: string){
    this.router.navigateByUrl(`products/form/${productId}`);
   }

   deleteProduct(productId: string){
     
    this.confirmationService.confirm({
            message: 'Do you want to Delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.productsService.deleteProduct(productId).pipe(takeUntil(this.endswith$)).subscribe((product: Product) => {
                this._getProducts();
                this.messageService.add({
                  severity:'success', 
                  summary:'Success', 
                  detail:`Product ${product.name} is Deleted`
                });
              }, 
              () => {
                this.messageService.add({
                  severity:'error', 
                  summary:'Error', 
                  detail:'Product is not Deleted'
                });
              })
            },
            reject: () => {}
        });

    
  }


}
