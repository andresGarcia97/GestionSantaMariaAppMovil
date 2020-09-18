import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario-guard/usuario-guard.guard';

const routes: Routes = [
  {
    path: 'changue-password',
    loadChildren: () => import('./pages/changue-password/changue-password.module').then( m => m.ChanguePasswordPageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'horarios-loza',
    loadChildren: () => import('./pages/horarios-loza/horarios-loza.module').then( m => m.HorariosLozaPageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'labor',
    loadChildren: () => import('./pages/labor/labor.module').then( m => m.LaborPageModule),
    canLoad: [UsuarioGuard]
  },
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
    loadChildren: () => import('./mainTabs/tabs/tabs.module').then(m => m.TabsPageModule),
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
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
