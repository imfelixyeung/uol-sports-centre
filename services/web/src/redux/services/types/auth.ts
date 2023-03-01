export interface Credentials {
  email: string;
  password: string;
}

export interface DecodedJsonWebToken {
  email: string;
  type: 'access';
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  jti: string;
}

type AccessToken = string;
type RefreshToken = string;

export interface Tokens {
  token: AccessToken;
  refreshToken: RefreshToken;
}

export type LoginRequest = Credentials;

export type RegisterRequest = Credentials;

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  data: Tokens;
}

export interface RegisterResponse {
  success: boolean;
  data: Tokens;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: Tokens;
}

export interface GetSessionResponse {
  success: boolean;
  data: DecodedJsonWebToken;
}
