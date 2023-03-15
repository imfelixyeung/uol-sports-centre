export interface UsersDBA {
  id: number;
  paymentID: number;
  firstName: string;
  lastName: string;
  membership: string;
}

export interface CreateUserDBA {
  id: number;
  paymentID?: number;
  firstName: string;
  lastName: string;
  membership?: string;
}

export interface EditUserDBA {
  id: number;
  paymentID?: number;
  firstName?: string;
  lastName?: string;
  membership?: string;
}
