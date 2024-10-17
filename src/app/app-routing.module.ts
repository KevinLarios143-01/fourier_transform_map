import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/layout/content/content.component';
import { content } from './shared/routes/content.routes';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: content,
  },
  /**
   * Rutas que no coincidan o sin ruta se redirige a la ruta raíz
   */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
