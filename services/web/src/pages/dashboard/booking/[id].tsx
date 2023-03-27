import type {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import Seo from '~/components/Seo';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useGetBookingQuery} from '~/redux/services/api';

const ViewBookingPage = () => {
  const router = useRouter();
  const bookingId = router.query.id;
  const bookingData = useGetBookingQuery(
    {bookingId: parseInt(bookingId as string)},
    {skip: !bookingId}
  );

  if (!bookingId) return <>Not found</>;
  if (Array.isArray(bookingId)) return <>Not found</>;

  const booking = bookingData.data?.booking;
  if (!booking) return <>Not found</>;

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
                  <Button intent="secondary" type="button">
                    Cancel Booking
                  </Button>
                }
                eventId={booking.eventId}
              />
            </div>
          </div>
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
