import type {FC} from 'react';
import {useState} from 'react';
import type {OnResultFunction} from 'react-qr-reader';
import {QrReader} from 'react-qr-reader';
import Json from '~/components/Json';
import Typography from '~/components/Typography';
import {useGetUserRecordQuery} from '~/redux/services/api';
import type {QrBooking} from '~/schema/qrBooking';
import {qrBookingSchema} from '~/schema/qrBooking';

const CheckInUserPage = () => {
  const [booking, setBooking] = useState<QrBooking | null>(null);
  const userData = useGetUserRecordQuery(booking?.userId ?? -1, {
    skip: !booking,
  });
  const customer = userData.data?.user;

  const onResult: OnResultFunction = result => {
    if (!result) return;

    const data = result.getText();
    let booking: QrBooking | Error | null = null;
    try {
      booking = qrBookingSchema.parse(JSON.parse(data));
    } catch (error) {
      booking = new Error('Malformed JSON');
    }

    if (!booking) return;

    if (booking instanceof Error) {
      console.error(booking);
      return;
    }

    setBooking(booking);
  };

  return (
    <div className="container py-8">
      <Typography.h1>Check in customer</Typography.h1>
      {!booking ? (
        <div>
          <Typography.h2>Scan the booking qr code</Typography.h2>
          <QrReader
            constraints={{facingMode: 'environment'}}
            onResult={onResult}
          />
        </div>
      ) : (
        <div>
          <Typography.h2>Results</Typography.h2>
          <Json data={booking} />
          {customer ? (
            <>
              <Typography.h3>Customer (ID {customer.id})</Typography.h3>
              <Typography.p>
                {customer.firstName} {customer.lastName}
              </Typography.p>
              <Typography.h3>Customer Bookings</Typography.h3>
              <ListBookings
                bookingIds={booking.bookingIds}
                userId={booking.userId}
              />
            </>
          ) : (
            <>Loading</>
          )}
        </div>
      )}
    </div>
  );
};

const ListBookings: FC<{
  bookingIds: number[];
  userId: number;
}> = ({bookingIds}) => {
  return (
    <div>
      <Typography.span>TODO</Typography.span>
      <ul className="list-inside list-disc">
        {bookingIds.map(bookingId => (
          <li key={bookingId}>
            <Typography.span>{bookingId}</Typography.span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckInUserPage;
