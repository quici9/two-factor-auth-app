import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient('http://192.168.43.196:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE');
  }

  // TODO: Test with user id = 29f7ef03-2f47-450b-a4f4-d278f4d2fb91
  // Lưu secret vào bảng users
  async updateUserSecret(userId: string, secret: string) {
    const { data, error } = await this.supabase
      .from('users')
      .update({ two_factor_secret: secret })
      .eq('id', userId);
    return { data, error };
  }

  // Lấy secret từ bảng users
  async getUserSecret(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('two_factor_secret')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching secret:', error);
      return null;
    }
    return data?.two_factor_secret;
  }
}
