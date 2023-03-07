export interface usersDBA {
  id: number;
  accountID: number;
  paymentID: number;
  bookingID: number;
  firstName: String;
  lastName: String;
  membership: String;
}

export interface CreateUserDBA {
  id: number;
  accountID?: number;
  paymentID?: number;
  bookingID?: number;
  firstName: String;
  lastName: String;
  membership?: String;
}

export interface EditUserDBA {
  id: number;
  accountID?: number;
  paymentID?: number;
  bookingID?: number;
  firstName?: String;
  lastName?: String;
  membership?: String;
}
