import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { UsuarioGuard } from './guards/guards/usuario-guard.guard';

const routes: Routes = [
  {
    path: 'updateuser',
    loadChildren: () => import('./pages/updateuser/updateuser.module').then( m => m.UpdateuserPageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'datos-estudiante',
    loadChildren: () => import('./pages/datos-estudiante/datos-estudiante.module').then( m => m.DatosEstudiantePageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pestañas/tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main/tabs/tab1'
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
