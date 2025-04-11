import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product, ProductResponse } from '../../services/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [
     CommonModule,
        ReactiveFormsModule,  // ✅ Ajout de ReactiveFormsModule ici
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule,
        RouterModule,
         MatPaginatorModule,
         MatTableModule
     
      ]
      
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'price', 'actions'];
  products: Product[] = [];
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 10;
  filterForm: FormGroup;

  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  
  ) {
    this.filterForm = this.fb.group({
      produitIdFilter: [''],   // Utilise "produitIdFilter" ici
      nameFilter: ['']         // Utilise "nameFilter" ici
    });
   }

   ngOnInit(): void {
    this.loadProducts();

    // Écouter les changements dans les contrôles de filtre
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }


  // Appliquer les filtres
  applyFilters(): void {
    this.page = 1;  // Réinitialiser la page à la première page lors de l'application du filtre
    this.loadProducts();
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.filterForm.reset();
    this.loadProducts();
  }

  // Charger les produits avec les filtres appliqués
  loadProducts(): void {
    const { produitIdFilter, nameFilter } = this.filterForm.value;
    this.productService.getProducts(this.page, this.pageSize, produitIdFilter, nameFilter).subscribe({
      next: (data: ProductResponse) => {
        this.products = data.products;
        this.totalItems = data.totalItems;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 });
      }
    });
  }
  
  navigateToProductDetail(produitID?: number): void {
    if (produitID !== undefined) {
      this.router.navigate(['/products/detail', produitID]);
    } else {
      console.error('Produit ID is undefined');
    }
  }

  navigateToEditProduct(produitID?: number): void {
    if (produitID !== undefined) {
      this.router.navigate(['/products/edit', produitID]);
    } else {
      console.error('Produit ID is undefined');
    }
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/products/add']);
  }

  deleteProduct(produitID?: number): void {
    if (produitID !== undefined) {
      this.productService.deleteProduct(produitID).subscribe({
        next: () => {
          this.loadProducts();
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la suppression du produit', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      console.error('Produit ID is undefined');
    }
  }

  // Méthode pour changer de page de produits
  onPageChange(event: any): void {
    this.page = event.pageIndex + 1; // Angular Material utilise des indices de page de 0
    this.pageSize = event.pageSize;
    this.loadProducts();
  }
}  