import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class ClientDetailComponent implements OnInit {
  client?: Client;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const clientId = this.route.snapshot.params['id'];
    this.clientService.getClient(clientId).subscribe({
      next: (data) => (this.client = data),
      error: (err) => console.error(err)
    });
  }

  navigateBack(): void {
    this.router.navigate(['/clients']);
  }

  // ✅ Aller à la page de modification du client
  navigateToEditClient(): void {
    if (this.client?.clientID) {
      this.router.navigate(['/clients/edit', this.client.clientID]);
    }
  }

  // ✅ Aller à la page pour passer une nouvelle commande pour ce client
  navigateToNewOrder(): void {
    if (this.client?.clientID) {
      this.router.navigate(['/commandes/add'], { queryParams: { clientID: this.client.clientID } });
    }
  }

  // ✅ Supprimer le client et revenir à la liste
  deleteClient(): void {
    if (this.client?.clientID && confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(this.client.clientID).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
