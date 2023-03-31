export interface User {
  id: number;
  firstName: string;
  lastName: string;
  paymentID: string | null;
  membership: string | null;
}
export interface UsersResponse {
  status: 'OK';
  user: User;
}

export type UsersViewFullRecordResponse = UsersResponse;
export type UsersViewFullRecordRequest = {
  userId: number;
};

export type UsersCreateRequest = Pick<User, 'id' | 'firstName' | 'lastName'>;
export type UsersCreateResponse = UsersResponse;

export type UsersUpdateFirstNameRequest = Pick<User, 'id' | 'firstName'>;
export type UsersUpdateFirstNameResponse = UsersResponse;

export type UsersUpdateLastNameRequest = Pick<User, 'id' | 'lastName'>;
export type UsersUpdateLastNameResponse = UsersResponse;

export type UsersUpdateMembershipRequest = Pick<User, 'id' | 'membership'>;
export type UsersUpdateMembershipResponse = UsersResponse;
