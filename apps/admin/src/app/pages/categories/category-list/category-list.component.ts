import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService, Category } from '@bluebits/products';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'admin-category-list',
  templateUrl: './category-list.component.html',
  styles: [],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endsubs$ : Subject<any> = new Subject();
  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this._getCategories()
  }

  ngOnDestroy(){
    // this.endsubs$.next(true);
  	this.endsubs$.complete();
  }

  deleteCategory(categoryId: string){
    this.confirmationService.confirm({
            message: 'Do you want to Delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.categoriesService.deleteCategory(categoryId).subscribe((category: Category) => {
                this._getCategories();
                this.messageService.add({
                  severity:'success', 
                  summary:'Success', 
                  detail:`Category ${category.name} is Deleted`
                });
              }, 
              () => {
                this.messageService.add({
                  severity:'error', 
                  summary:'Error', 
                  detail:'Category is not Deleted'
                });
              })
            },
            reject: () => {}
        });

    
  }

  updateCategory(categoryId: string){
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  private _getCategories() {
   this.categoriesService.getCategories()
   .pipe(takeUntil(this.endsubs$))
   .subscribe(cats => {
      this.categories = cats;
    }) 
  }
}
