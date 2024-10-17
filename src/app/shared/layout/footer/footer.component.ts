import { Component } from '@angular/core';
import { Config } from 'src/app/constante/config.enum';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [MatCardModule],
  standalone: true
})
export class FooterComponent {
  ambiente:string = environment.AMBIENTE
  fechaPublicacion:string = Config.FECHA_PUBLICACION
  version:string = Config.VERSION
}
