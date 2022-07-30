import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '@bluebits/orders';
import { OrdersService, ORDER_STATUS } from '@bluebits/orders'
import { Router } from '@angular/router'
import {ConfirmationService, MessageService} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderStatus = ORDER_STATUS;
  endswith$ : Subject<any> = new Subject();
  constructor(
    private OrdersService: OrdersService, 
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
  	this._getOrders();
  }

  ngOnDestroy() {
    this.endswith$.next(null);
    this.endswith$.complete();
  }

  _getOrders(){
  	this.OrdersService.getOrders().pipe(takeUntil(this.endswith$)).subscribe((orders) => {
  		this.orders = orders;
  	})
  }

  showOrder(orderId: string){ 
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteOrder(orderId: string){
     this.confirmationService.confirm({
            message: 'Do you want to Delete this Order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.OrdersService.deleteOrder(orderId).pipe(takeUntil(this.endswith$)).subscribe((order: Order) => {
                this._getOrders();
                this.messageService.add({
                  severity:'success', 
                  summary:'Success', 
                  detail:`Order ${order.id} is Deleted`
                });
              }, 
              () => {
                this.messageService.add({
                  severity:'error', 
                  summary:'Error', 
                  detail:'Order is not Deleted'
                });
              })
            },
            reject: () => {}
        });

  }

}
