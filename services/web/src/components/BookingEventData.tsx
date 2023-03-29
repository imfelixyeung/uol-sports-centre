import type {FC} from 'react';
import {useGetBookingEventsQuery} from '~/redux/services/api';
import type {BookingEvent} from '~/redux/services/types/bookings';
import type {
  Facility,
  FacilityActivity,
} from '~/redux/services/types/facilities';
import FacilityActivityData from './FacilityActivityData';

const BookingEventData: FC<{
  eventId: number;
  pick?: keyof BookingEvent;
  expandActivity?: keyof FacilityActivity;
  expandFacility?: keyof Facility;
}> = ({eventId, pick, expandActivity, expandFacility}) => {
  const fallback = `Event ${eventId}`;
  const bookingEvents = useGetBookingEventsQuery();

  if (bookingEvents.isLoading || bookingEvents.isError || !bookingEvents.data)
    return <>{fallback}</>;

  const events = bookingEvents.data.events;
  const event = events.find(event => event.id === eventId);

  if (!event) return <>{fallback}</>;

  if (expandActivity)
    return (
      <FacilityActivityData
        activityId={event.activityId}
        pick={expandActivity}
        expandFacility={expandFacility}
      />
    );

  if (!pick) return <>{fallback}</>;

  return <>{event[pick]}</>;
};

export default BookingEventData;
