import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pestañas/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'updateuser',
    loadChildren: () => import('./pages/updateuser/updateuser.module').then( m => m.UpdateuserPageModule)
  },
  {
    path: 'datos-estudiante',
    loadChildren: () => import('./pages/datos-estudiante/datos-estudiante.module').then( m => m.DatosEstudiantePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
