import { Routes } from '@angular/router';
import {TwoFactorAuthComponent} from "./two-factor-auth/two-factor-auth.component";

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }, // Route mặc định
  { path: '', component: TwoFactorAuthComponent },   // Route để hiển thị component 2FA
  // Thêm các route khác nếu cần
];
