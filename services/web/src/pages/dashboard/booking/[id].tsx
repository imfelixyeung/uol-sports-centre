import type {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import {QRCodeSVG} from 'qrcode.react';
import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import Seo from '~/components/Seo';
import {toast} from 'react-hot-toast';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {
  useCancelBookingMutation,
  useGetBookingQuery,
} from '~/redux/services/api';
import type {QrBooking} from '~/schema/qrBooking';

const ViewBookingPage = () => {
  const router = useRouter();
  const {session, token} = useAuth();
  const bookingId = router.query.id;
  const [cancelBooking] = useCancelBookingMutation();
  const bookingData = useGetBookingQuery(
    {bookingId: parseInt(bookingId as string), token: token!},
    {skip: !bookingId}
  );

  if (!bookingId) return <>Not found</>;
  if (Array.isArray(bookingId)) return <>Not found</>;

  const booking = bookingData.currentData?.booking;
  if (!booking) return <>Booking not found</>;

  console.log(booking);

  const qrBooking: QrBooking = {
    bookingIds: [booking.id],
    userId: session!.user.id,
  };

  const onCancel = async () => {
    await toast.promise(
      cancelBooking({bookingId: parseInt(bookingId), token: token!}).unwrap(),
      {
        loading: 'Cancelling booking...',
        success: 'Booking cancelled',
        error: 'Failed to cancel booking',
      }
    );
    await router.push('/dashboard/bookings');
  };

  return (
    <>
      <Seo title="View Activity" />
      <div className="grow bg-white text-black">
        <div className="container my-8">
          <div className="bg-black text-white">
            <div className="h-32 bg-hero bg-cover bg-center"></div>
            <div className="flex flex-col gap-3 p-6">
              <BookingActivity
                variant="page"
                datetime={new Date(booking.starts)}
                action={
                  <Button
                    intent="secondary"
                    type="button"
                    onClick={() => void onCancel()}
                  >
                    Cancel Booking
                  </Button>
                }
                eventId={booking.eventId}
              />
            </div>
          </div>
          <section>
            <Typography.h2>Show the QR Code below to the staff</Typography.h2>
            <div className="flex justify-center">
              <div className="bg-[#fff] p-8">
                <QRCodeSVG
                  value={JSON.stringify(qrBooking)}
                  className="aspect-square h-full max-h-[50vw] w-full max-w-[50vw]"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(ViewBookingPage)
);
export const getStaticPaths: GetStaticPaths = async () => {
  return await Promise.resolve({
    fallback: true,
    paths: [],
  });
};

export const getStaticProps: GetStaticProps = async () => {
  return await Promise.resolve({props: {}});
};
