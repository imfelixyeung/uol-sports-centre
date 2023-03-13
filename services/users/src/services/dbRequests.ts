export interface usersDBA {
  id: number;
  accountID: number;
  paymentID: number;
  bookingID: number;
  firstName: string;
  lastName: string;
  membership: string;
}

export interface CreateUserDBA {
  id: number;
  accountID?: number;
  paymentID?: number;
  bookingID?: number;
  firstName: string;
  lastName: string;
  membership?: string;
}

export interface EditUserDBA {
  id: number;
  accountID?: number;
  paymentID?: number;
  bookingID?: number;
  firstName?: string;
  lastName?: string;
  membership?: string;
}
