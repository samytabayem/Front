import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { AdressListComponent } from './components/adress-list/adress-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { CommandeFormComponent } from './components/commande-form/commande-form.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdressFormComponent } from './components/adress-form/adress-form.component';


export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' }, // Redirection par défaut
  { path: 'products', component: ProductListComponent },
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'products/detail/:id', component: ProductDetailComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/add', component: ClientFormComponent },
  { path: 'clients/edit/:id', component: ClientFormComponent },
  { path: 'clients/detail/:id', component: ClientDetailComponent },
  { path: 'commandes', component: CommandeListComponent },
  { path: 'commandes/add', component: CommandeFormComponent },
  { path: 'commandes/edit/:id', component: CommandeFormComponent },
  { path: 'adress', component: AdressListComponent },
  { path: 'adress/add', component: AdressFormComponent },
  { path: 'adress/edit/:id', component: AdressFormComponent },
];


