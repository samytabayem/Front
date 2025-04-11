import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-client-list',
  standalone: true,
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
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
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  totalItems: number = 0;
  filterForm: FormGroup;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire de filtre
    this.filterForm = this.fb.group({
      clientId: [''],
      firstName: [''],
      lastName: [''],
      country: [''],
    });
  }

  ngOnInit(): void {
    this.loadClients();

    // Écoute les changements du formulaire de filtre pour appliquer les filtres
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    const { clientId, firstName, lastName, country } = this.filterForm.value;
    this.loadClients(1, 10, clientId, firstName, lastName, country);
  }

  // Charger les clients avec les filtres appliqués
  loadClients(
    page: number = 1, 
    pageSize: number = 10, 
    clientId?: number, 
    firstName?: string, 
    lastName?: string, 
    country?: string
  ): void {
    this.clientService.getClients(page, pageSize, clientId, firstName, lastName, country).subscribe({
      next: (data) => {
        this.clients = data.clients;
        this.totalItems = data.totalItems;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.filterForm.reset();
    this.loadClients();
  }

  navigateToAddClient(): void {
    this.router.navigate(['/clients/add']);
  }

  navigateToEditClient(id: number): void {
    this.router.navigate(['/clients/edit', id]);
  }

  navigateToClientDetail(id: number): void {
    this.router.navigate(['/clients/detail', id]);
  }

  deleteClient(id?: number): void {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadClients();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
