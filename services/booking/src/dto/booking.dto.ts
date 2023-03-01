export interface BookingDTO {
  id: number;
  userId: number;
  facilityId: number;
  transactionId: number;
  startTime: Date;
  duration: number;
}

export interface CreateBookingDTO {
  userId: number;
  facilityId: number;
  transactionId: number;
  startTime: Date;
  duration: number;
}

export interface UpdateBookingDTO {
  id: number;
  userId?: number;
  facilityId?: number;
  transactionId?: number;
  startTime?: Date;
  duration?: number;
}
