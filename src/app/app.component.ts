import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ On passe en standalone
  imports: [RouterModule, MatTabsModule, MatCardModule], // ✅ Ajoutez les imports nécessaires
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }
  onTabChange(event: MatTabChangeEvent) {
    const index = event.index;
    switch (index) {
      case 0:
        this.router.navigate(['/products']);
        break;
      case 1:
        this.router.navigate(['/clients']);
        break;
      case 2:
        this.router.navigate(['/commandes']);
        break;
        case 3:
          this.router.navigate(['/adress']);
          break;
      default:
        break;
    }
  }
}

