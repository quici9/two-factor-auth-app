import {Component, OnInit} from '@angular/core';
import {TwoFactorAuthService} from "../two-factor-auth.service";
import {SupabaseService} from "../supabase.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.css'
})
export class TwoFactorAuthComponent implements OnInit {
  qrCodeUrl!: string;
  token!: string;
  userId: string = '29f7ef03-2f47-450b-a4f4-d278f4d2fb91'; // Lấy ID người dùng từ Supabase
  userEmail: string = 'user@example.com'; // Email người dùng

  constructor(
    private twoFactorAuthService: TwoFactorAuthService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    // Kích hoạt 2FA và hiển thị mã QR
    this.twoFactorAuthService.enableTwoFactorAuth(this.userId, this.userEmail).then(qrCodeUrl => {
      this.qrCodeUrl = qrCodeUrl;
    });
  }

  // Xác thực mã OTP
  verifyToken(): void {
    this.supabaseService.getUserSecret(this.userId).then(secret => {
      const isValid = this.twoFactorAuthService.verifyToken(this.token, secret);
      if (isValid) {
        alert('Xác thực thành công!');
      } else {
        alert('Mã OTP không đúng!');
      }
    });
  }
}
