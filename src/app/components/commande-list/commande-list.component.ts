import { Component, OnInit } from '@angular/core';
import { CommandeService, Commande } from '../../services/commande.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css'],

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
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  displayedColumns: string[] = ['numCommande', 'date', 'clientID', 'produits', 'actions'];
  filterForm: FormGroup;

  constructor(
    private commandeService: CommandeService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire de filtre
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadCommandes();

    // Écoute les changements du formulaire de filtre pour appliquer les filtres
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    const { startDate, endDate } = this.filterForm.value;
    this.loadCommandes(startDate, endDate);
  }

  // Charger les commandes avec les filtres appliqués
  loadCommandes(startDate?: string, endDate?: string): void {
    const page = 1;
    const pageSize = 10;

    this.commandeService.getCommandes(page, pageSize, startDate, endDate).subscribe({
      next: (data) => (this.commandes = data),
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.filterForm.reset();
    this.loadCommandes();
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => {
          this.snackBar.open('Commande supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadCommandes();
        },
        error: (err) => console.error(err)
      });
    }
  }

  navigateToAddCommande(): void {
    this.router.navigate(['/commandes/add']);
  }

  navigateToEditCommande(id: number): void {
    this.router.navigate(['/commandes/edit', id]);
  }

  navigateToDetailClient(id: number): void {
    this.router.navigate(['/clients/detail', id]);
  }
}
