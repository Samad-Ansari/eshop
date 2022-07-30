import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UsersService } from '@bluebits/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: any = [];
  endswith$ : Subject<any> = new Subject();
  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
  	combineLatest([
  		this.ordersService.getOrdersCount(),
  		this.productService.getProductsCount(),
  		this.userService.getUsersCount(),
  		this.ordersService.getTotalSales()
  	]).pipe(takeUntil(this.endswith$)).subscribe((values: any) => {
  		this.statistics = values
  		this.statistics[0] = values[0]['ordercount']
  		this.statistics[3] = values[3][0]['totalSales']
  	})
  }

  ngOnDestroy() {
    this.endswith$.complete();
  }
}
