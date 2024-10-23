import * as QRCode from 'qrcode';
import { Injectable } from '@angular/core';
import {SupabaseService} from "./supabase.service";
import { TOTP } from 'jsotp'; // Thư viện js-otp để xử lý OTP

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthService {
  constructor(private supabaseService: SupabaseService) {}

  // Tạo secret ngẫu nhiên sử dụng Web Crypto API và mã hóa base32
  generateSecret(): string {
    const array = new Uint8Array(16); // Kích thước 16 byte để tạo secret
    window.crypto.getRandomValues(array); // Sử dụng Web Crypto API để tạo giá trị ngẫu nhiên

    // Chuyển đổi sang chuỗi base32
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    return Array.from(array, byte => base32chars[byte % 32]).join('');
  }

  // Tạo URL mã QR cho Google Authenticator
  async generateQRCode(secret: string, userEmail: string): Promise<string> {
    const otpauthUrl = `otpauth://totp/YourAppName:${userEmail}?secret=${secret}&issuer=YourAppName`;

    try {
      const qrCode = await QRCode.toDataURL(otpauthUrl); // Tạo mã QR dựa trên URL otpauth
      return qrCode;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  }

  // Xác thực mã OTP sử dụng js-otp
  verifyToken(token: string, secret: string): boolean {
    const totp = new TOTP(secret); // Tạo đối tượng TOTP từ js-otp
    return totp.verify(token); // Kiểm tra mã OTP có khớp với mã được tạo từ secret không
  }

  // Kích hoạt xác thực 2 yếu tố và lưu secret vào Supabase
  async enableTwoFactorAuth(userId: string, userEmail: string): Promise<string> {
    const secret = this.generateSecret(); // Tạo secret mới

    // Lưu secret vào Supabase
    const { data, error } = await this.supabaseService.updateUserSecret(userId, secret);
    if (error) {
      console.error('Error saving secret:', error);
      return '';
    }

    // Tạo mã QR để người dùng quét bằng Google Authenticator
    const qrCodeUrl = await this.generateQRCode(secret, userEmail);
    return qrCodeUrl;
  }
}
