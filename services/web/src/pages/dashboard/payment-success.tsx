import {useRouter} from 'next/router';
import {QRCodeSVG} from 'qrcode.react';
import {useMemo} from 'react';
import Json from '~/components/Json';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import type {QrBooking} from '~/schema/qrBooking';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const bookingId = router.query.bookingId ?? null;

  const booking = useMemo(() => {
    if (!bookingId) return null;
    if (!auth.session?.user.id) return null;

    const bookingIds = Array.isArray(bookingId) ? bookingId : [bookingId];
    console.log(bookingIds);
    console.log(bookingIds.map(parseInt));

    const booking: QrBooking = {
      bookingIds: bookingIds.map(id => parseInt(id)),
      userId: auth.session?.user.id,
    };

    return booking;
  }, [auth.session?.user.id, bookingId]);

  if (!bookingId) return <>Invalid request</>;
  if (!auth.session?.user.id) return <>Not logged in</>;

  return (
    <div className="container py-8">
      <Typography.h1>Booking Successful!</Typography.h1>
      <Typography.h2>Show the QR Code below to the staff</Typography.h2>
      <div className="flex justify-center">
        <div className="bg-[#fff] p-8">
          <QRCodeSVG
            value={JSON.stringify(booking)}
            className="aspect-square h-full max-h-[50vw] w-full max-w-[50vw]"
          />
        </div>
      </div>
      <Json data={booking} />
    </div>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(PaymentSuccessPage)
);
