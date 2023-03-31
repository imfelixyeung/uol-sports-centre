export const authUserRoles = ['USER', 'EMPLOYEE', 'MANAGER', 'ADMIN'] as const;
export type AuthUserRole = (typeof authUserRoles)[number];

export interface Credentials {
  email: string;
  password: string;
}

export interface DecodedJsonWebToken {
  user: {
    id: number;
    email: string;
    role: AuthUserRole;
  };
  type: 'access';
  iat: number;
  exp: number;
  iss: string;
  sub: number;
  jti: string;
}

type AccessToken = string;
type RefreshToken = string;

export interface Tokens {
  token: AccessToken;
  refreshToken: RefreshToken;
}

export interface AuthUser {
  id: number;
  email: string;
  role: AuthUserRole;
  createdAt: string;
  updatedAt: string;
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

export interface UpdateUserRoleRequest {
  userId: number;
  role: AuthUserRole;
}

export interface GetAuthUsersResponse {
  success: boolean;
  data: AuthUser[];
}

export type GetAuthUsersRequest = {
  role?: AuthUserRole;
  pageIndex?: number;
  limit?: number;
};

export interface GetAuthUserResponse {
  success: boolean;
  data: AuthUser;
}

export type GetAuthUserRequest = {
  userId: number;
};
