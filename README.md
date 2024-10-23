# Angular 2FA (Two-Factor Authentication) with Google Authenticator

This project demonstrates how to implement two-factor authentication (2FA) in an Angular application using Google Authenticator. It leverages the `js-otp` library for TOTP (Time-based One-Time Password) generation and verification, and `QRCode` for generating scannable QR codes. The application also integrates with Supabase for user management and storing the secret keys.

## Features

- **2FA Setup**: Generates a TOTP secret and provides a QR code for users to scan using Google Authenticator.
- **2FA Verification**: Allows users to enter their OTP to verify their identity.
- **Supabase Integration**: Stores user-specific TOTP secrets in Supabase.
- **Frontend Only**: Uses Web Crypto API and is fully implemented in the frontend.

## Requirements

- Node.js and npm
- Angular CLI
- Supabase account (for backend storage)
- Google Authenticator app (for generating OTPs)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/quici9/two-factor-auth-app.git
cd two-factor-auth-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:
  - Sign up at [Supabase](https://supabase.io/).
  - Create a new project and configure a `users` table.
  - Store the `id`, `email`, and `two_factor_secret` in the `users` table.

4. Create the `users` table in Supabase by running the following SQL query:

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  two_factor_secret text,
  created_at timestamp with time zone DEFAULT now()
);
```

5. Update the Supabase credentials in `src/app/supabase.service.ts`:

```typescript
const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
```

6. Start the application:

```bash
ng serve
```

## Usage

### Setting Up 2FA

1. When the user logs in or creates an account, they will be prompted to set up two-factor authentication.
2. The application will generate a unique secret and display a QR code that can be scanned using Google Authenticator.
3. The secret is stored in the `users` table in Supabase for future OTP verification.

### Verifying OTP

1. After scanning the QR code, Google Authenticator will generate a time-based OTP.
2. The user enters the OTP into the application.
3. The application verifies the OTP using the `jsotp` library and confirms if the code is correct.

## File Structure

- `src/app/two-factor-auth.service.ts`: The main service responsible for generating secrets, creating QR codes, and verifying OTPs.
- `src/app/two-factor-auth.component.ts`: The component responsible for displaying the QR code and OTP input field.
- `src/app/supabase.service.ts`: Handles communication with Supabase for storing and retrieving user data.

## Dependencies

- [Angular](https://angular.io/)
- [QRCode](https://www.npmjs.com/package/qrcode) - For generating scannable QR codes.
- [jsotp](https://www.npmjs.com/package/jsotp) - For TOTP generation and verification.
- [Supabase](https://supabase.io/) - For backend storage of user secrets and authentication data.

## Key Functions

### `TwoFactorAuthService`

- **`generateSecret()`**: Generates a random base32 encoded secret using the Web Crypto API.
- **`generateQRCode(secret: string, userEmail: string)`**: Generates a scannable QR code that can be used by Google Authenticator.
- **`verifyToken(token: string, secret: string)`**: Verifies the OTP entered by the user with the stored secret.

### `SupabaseService`

Handles storing and retrieving user-specific secrets in the Supabase database.
