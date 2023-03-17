export interface User {
  id: number;
  firstName: string;
  lastName: string;
  paymentID: string | null;
  membership: string | null;
}

export type UsersViewFullRecordResponse = {
  status: 'OK';
  user: User;
};

export type UsersCreateRequest = Pick<User, 'id' | 'firstName' | 'lastName'>;

export type UsersCreateResponse = {
  status: 'OK';
  user: User;
};
