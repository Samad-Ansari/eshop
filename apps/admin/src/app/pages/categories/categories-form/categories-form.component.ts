import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@bluebits/products';
import { Location } from '@angular/common';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import {MessageService} from 'primeng/api';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {

  form: any;
  isSubmitted = false;
  editmode = false;
  currentCategoryId: string = '';
  endsubs$: Subject<any> = new Subject();
  constructor(
    private messageService: MessageService, 
    private formBuilder: FormBuilder, 
    private categoriesService: CategoriesService,
    private location: Location,
    private route: ActivatedRoute
    ) { 
  }

  ngOnInit(): void {
  	this.form = this.formBuilder.group({
  		name: ['', Validators.required],
  		icon: ['', Validators.required],
      color: ['#fff']
  	})

    this._checkEditMode();
  }

  ngOnDestroy(){
    // this.endsubs$.next(true);
    this.endsubs$.complete();
  }

  private _checkEditMode(){
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe( (params: any) => {
      if(params.id) {
        this.editmode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id).subscribe(category =>{
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
          this.categoryForm.color.setValue(category.color);
        })
      }
    })
  }

  get categoryForm() {
    return this.form.controls;
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }
    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    }
    if(this.editmode){
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }
  }

  onCancel(){
    this.location.back();
  }

  private _addCategory(category: Category){
    this.categoriesService.createCategory(category).pipe(takeUntil(this.endsubs$)).subscribe(
      (category: Category) => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`Category ${category.name} is Created`
      });
      timer(1000).toPromise().then( () => {
        this.location.back();
      })
    }, 
    () => {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'Category is not Created'
     });
    });

  }

  private _updateCategory(category: Category){
    this.categoriesService.updateCategory(category).pipe(takeUntil(this.endsubs$)).subscribe(response => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'Category is Updated'
      });
      timer(1000).toPromise().then( done => {
        this.location.back();
      })
    }, 
    () => {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'Category is not Updated'});
    });

  }

  
}
