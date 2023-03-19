import dayjs from 'dayjs';
import type {FC} from 'react';
import type {FacilityTime} from '~/redux/services/types/facilities';

const OpeningHours: FC<{
  openingHours: Omit<FacilityTime, 'facility_id'>[];
}> = ({openingHours}) => {
  return (
    <table>
      <thead className="text-left">
        <tr>
          <th className="p-2">Day</th>
          <th className="p-2">Hours</th>
        </tr>
      </thead>
      <tbody>
        {openingHours.map(hours => {
          const {id, closing_time, day, opening_time} = hours;
          const formattedOpeningTime = dayjs(opening_time * 1000 * 60).format(
            'HH:mm'
          );
          const formattedClosingTime = dayjs(closing_time * 1000 * 60).format(
            'HH:mm'
          );
          const formattedOpeningHours = `${formattedOpeningTime}-${formattedClosingTime}`;
          return (
            <tr key={id}>
              <td className="p-2">{day}</td>
              <td className="p-2">{formattedOpeningHours}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OpeningHours;
