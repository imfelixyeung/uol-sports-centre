import type {GetStaticPaths, GetStaticProps} from 'next';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import Seo from '~/components/Seo';

const ViewBookingPage = () => {
  const [tempBooked, setTempBooked] = useState(false);

  const toggle = () => setTempBooked(prev => !prev);

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
                datetime={new Date('2023-01-01')}
                name="Activity Name"
                facility="Facility"
                action={
                  <>
                    {tempBooked ? (
                      <Button intent="primary" onClick={toggle}>
                        Book Session
                      </Button>
                    ) : (
                      <Button intent="secondary" onClick={toggle}>
                        Cancel Booking
                      </Button>
                    )}
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewBookingPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return await Promise.resolve({
    fallback: true,
    paths: [],
  });
};

export const getStaticProps: GetStaticProps = async () => {
  return await Promise.resolve({props: {}});
};
