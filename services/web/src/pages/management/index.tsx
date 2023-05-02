import dayjs from 'dayjs';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import {Form, Formik} from 'formik';
import type {NextPage} from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type {FC} from 'react';
import {useState} from 'react';
import {toast} from 'react-hot-toast';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {
  useChangeDiscountAmountMutation,
  useChangePricesMutation,
  useCreateFacilityActivityMutation,
  useCreateFacilityMutation,
  useCreateFacilityTimesMutation,
  useGetFacilitiesQuery,
  useGetFacilityActivitiesQuery,
  useGetFacilityTimeQuery,
  useGetFacilityTimesQuery,
  useGetPricesQuery,
  useUpdateAuthUserMutation,
  useUpdateFacilityActivityMutation,
  useUpdateFacilityMutation,
  useUpdateFacilityTimeMutation,
} from '~/redux/services/api';
import type {ProductType} from '~/redux/services/types/payments';
import {productTypes} from '~/redux/services/types/payments';
import getErrorFromAPIResponse from '~/utils/getErrorFromAPIResponse';
dayjs.extend(customParseFormatPlugin);

const SalesGraphs = dynamic(() => import('~/components/SalesGraph'), {
  ssr: false,
});

const ManagementPage: NextPage = () => {
  return (
    <>
      <PageHero title="Managemer Dashboard" />
      <section className="container flex flex-col gap-3 py-8">
        <Typography.h2>Amend Prices</Typography.h2>
        {productTypes.map(productType => (
          <UpdatePricesFormWrapper
            key={productType}
            productType={productType}
          />
        ))}
        <Typography.h2>Change discount amount</Typography.h2>
        <UpdateDiscountForm />
        <Typography.h2>Add new employee</Typography.h2>
        <AddNewEmployeeForm />
        <Typography.h2>Add facility</Typography.h2>
        <AddFacilityForm />
        <Typography.h2>Amend facility</Typography.h2>
        <UpdateFacilityForm />
        <Typography.h2>Amend facility opening hours</Typography.h2>
        <UpdateOpeningHoursForm />
        <Typography.h2>Add activity</Typography.h2>
        <AddActivityForm />
        <Typography.h2>Amend activity</Typography.h2>
        <UpdateActivityForm />
        <Typography.h2>Data visualisation from today to today-7</Typography.h2>
        <Typography.h3>Total sales</Typography.h3>
        <SalesGraphs />
        <Typography.h2>Manage users</Typography.h2>
        <Link href="/management/users">Manage</Link>
      </section>
    </>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(ManagementPage),
  {rolesAllowed: ['ADMIN', 'MANAGER']}
);

const UpdatePricesFormWrapper: FC<{
  productType: ProductType;
}> = ({productType}) => {
  const {token} = useAuth();
  const pricesData = useGetPricesQuery({
    productType,
    token: token!,
  });

  const prices = pricesData.data;

  if (!prices) return <>Maybe loading</>;

  return (
    <>
      {prices.map((price, index) => {
        return (
          <UpdatePricesForm
            key={index}
            productName={price.productName}
            productPrice={price.price}
          />
        );
      })}
    </>
  );
};

const UpdatePricesForm: FC<{
  productName: string;
  productPrice: string;
}> = ({productName, productPrice}) => {
  const {token} = useAuth();
  const [updatePrice] = useChangePricesMutation();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        productName,
        productPrice,
      }}
      onSubmit={async (values, actions) => {
        const {productName, productPrice} = values;
        await toast.promise(
          updatePrice({
            productName,
            price: Number(productPrice),
            token: token!,
          }).unwrap(),
          {
            loading: 'Updating price...',
            success: 'Price updated',
            error: 'Something went wrong...',
          }
        );
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormField label="Product Name" required name="productName" disabled />
        <FormField label="Product Price" required name="productPrice" />
        <Button intent="primary">Save</Button>
      </Form>
    </Formik>
  );
};

const AddNewEmployeeForm = () => {
  const [updateAuthUser] = useUpdateAuthUserMutation();
  const {token} = useAuth();

  return (
    <Formik
      enableReinitialize
      initialValues={{userId: undefined} as unknown as {userId: number}}
      onSubmit={async function (values, actions) {
        const {userId} = values;
        await toast.promise(
          updateAuthUser({
            role: 'EMPLOYEE',
            userId,
            token: token!,
          }).unwrap(),
          {
            loading: 'Adding new employee...',
            success: 'New employee added',
            error: error =>
              getErrorFromAPIResponse(error) || 'Something went wrong',
          }
        );
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormField label="User Id" required name="userId" />
        <Button type="submit" intent="primary">
          Add
        </Button>
      </Form>
    </Formik>
  );
};

const UpdateDiscountForm = () => {
  const [changeDiscountAmount] = useChangeDiscountAmountMutation();
  const {token} = useAuth();
  const discount = 0;
  return (
    <Formik
      enableReinitialize
      initialValues={{discount}}
      onSubmit={async (values, actions) => {
        const {discount} = values;

        await toast.promise(
          changeDiscountAmount({
            amount: discount,
            token: token!,
          }).unwrap(),
          {
            loading: 'Updating discount amount...',
            success: 'Discount amount updated',
            error: 'Something went wrong...',
          }
        );

        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormField label="Discount" required name="discount" />
        <Button type="submit" intent="primary">
          Update
        </Button>
      </Form>
    </Formik>
  );
};

const AddFacilityForm = () => {
  const [createFacility] = useCreateFacilityMutation();
  const [createTimes] = useCreateFacilityTimesMutation();
  const {token} = useAuth();
  return (
    <Formik
      enableReinitialize
      initialValues={{name: '', description: '', capacity: 0}}
      onSubmit={async (values, actions) => {
        const {name, capacity, description} = values;
        const result = await toast.promise(
          createFacility({name, capacity, description, token: token!}).unwrap(),
          {
            loading: 'Adding facility...',
            success: 'Facility added',
            error: 'Something went wrong',
          }
        );

        await toast.promise(
          Promise.all([
            daysOfTheWeek.map(day =>
              createTimes({
                token: token!,
                closing_time: 0,
                facility_id: result.facility.id,
                opening_time: 0,
                day,
              })
            ),
          ]),
          {
            loading: 'Adding facility times...',
            success: 'Facility times added',
            error: 'Something went wrong',
          }
        );

        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormField label="Facility Name" required name="name" />
        <FormField label="Facility Capacity" required name="capacity" />
        <FormField label="Facility Description" required name="description" />
        <Button type="submit" intent="primary">
          Add
        </Button>
      </Form>
    </Formik>
  );
};

const UpdateFacilityForm = () => {
  const [updateFacility] = useUpdateFacilityMutation();
  const facilitiesData = useGetFacilitiesQuery();
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null
  );
  const {token} = useAuth();

  if (!facilitiesData.data) return null;
  const facilities = facilitiesData.data;

  const selectedFacility = facilities.find(
    facility => facility.id === selectedFacilityId
  );

  return (
    <>
      <select
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        value={selectedFacilityId ?? 'null'}
        onChange={e => setSelectedFacilityId(parseInt(e.target.value))}
      >
        <option value="null" disabled>
          Select a facility
        </option>
        {facilities.map(facility => (
          <option value={facility.id} key={facility.id}>
            {facility.name}
          </option>
        ))}
      </select>
      {selectedFacilityId !== null && (
        <Formik
          enableReinitialize
          initialValues={{
            name: selectedFacility?.name ?? '',
            capacity: selectedFacility?.capacity ?? 0,
            description: selectedFacility?.description ?? '',
          }}
          onSubmit={async (values, actions) => {
            const {name, capacity, description} = values;
            await toast.promise(
              updateFacility({
                id: selectedFacilityId,
                name,
                capacity,
                description,
                token: token!,
              }),
              {
                loading: 'Updating facility...',
                success: 'Facility updated',
                error: 'Something went wrong',
              }
            );
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <FormField label="Facility Name" required name="name" />
            <FormField label="Facility Capacity" required name="capacity" />
            <FormField
              label="Facility Description"
              required
              name="description"
            />
            <Button type="submit" intent="primary">
              Update
            </Button>
          </Form>
        </Formik>
      )}
    </>
  );
};

const AddActivityForm = () => {
  const {token} = useAuth();
  const [createActivity] = useCreateFacilityActivityMutation();
  const facilitiesData = useGetFacilitiesQuery();
  const facilities = facilitiesData.data;
  if (!facilities) return null;

  return (
    <Formik
      enableReinitialize
      initialValues={{name: '', duration: 60, capacity: 0, facilityId: 0}}
      onSubmit={async (values, actions) => {
        const {name, capacity, duration, facilityId} = values;
        await toast.promise(
          createActivity({
            name,
            capacity,
            duration,
            facility_id: facilityId,
            token: token!,
          }),
          {
            loading: 'Adding new activity...',
            success: 'New activity added',
            error: 'Something went wrong',
          }
        );
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormField label="Facility" required name="facilityId" as="select">
          <option value="">Select a facility</option>
          {facilities.map(facility => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </FormField>
        <FormField label="Activity Name" required name="name" />
        <FormField label="Activity Duration" required name="duration" />
        <FormField label="Activity Capacity" required name="capacity" />
        <Button type="submit" intent="primary">
          Add
        </Button>
      </Form>
    </Formik>
  );
};

const UpdateActivityForm = () => {
  const {token} = useAuth();
  const [updateActivity] = useUpdateFacilityActivityMutation();
  const facilitiesData = useGetFacilitiesQuery();
  const activitiesData = useGetFacilityActivitiesQuery();
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );

  const facilities = facilitiesData.data;
  const activities = activitiesData.data;

  if (!facilities || !activities) return null;

  const selectedActivity = activities.find(
    activity => activity.id === selectedActivityId
  );

  return (
    <>
      <select
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        value={selectedActivityId ?? 'null'}
        onChange={e => setSelectedActivityId(parseInt(e.target.value))}
      >
        <option value="null" disabled>
          Select activity to amend
        </option>
        {activities.map(activity => {
          return (
            <option value={activity.id} key={activity.id}>
              {activity.name}
            </option>
          );
        })}
      </select>
      {selectedActivityId !== null && (
        <Formik
          enableReinitialize
          initialValues={{
            name: selectedActivity?.name ?? '',
            duration: selectedActivity?.duration ?? 0,
            capacity: selectedActivity?.capacity ?? 0,
            facilityId: selectedActivity?.facility_id ?? -1,
          }}
          onSubmit={async (values, actions) => {
            const {capacity, duration, facilityId, name} = values;
            await toast.promise(
              updateActivity({
                capacity,
                duration,
                facility_id: facilityId,
                name,
                id: selectedActivityId,
                token: token!,
              }).unwrap(),
              {
                loading: 'Updating activity',
                success: 'Activity updated',
                error: 'Failed to update activity',
              }
            );
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <FormField label="Facility" required name="facilityId" as="select">
              <option value="">Select a facility</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </FormField>
            <FormField label="Activity Name" required name="name" />
            <FormField label="Activity Duration" required name="duration" />
            <FormField label="Activity Capacity" required name="capacity" />
            <Button type="submit" intent="primary">
              Amend
            </Button>
          </Form>
        </Formik>
      )}
    </>
  );
};

const UpdateOpeningHoursForm = () => {
  const timesData = useGetFacilityTimesQuery();
  const facilitiesData = useGetFacilitiesQuery();
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null
  );

  if (!timesData.data) return null;
  if (!facilitiesData.data) return null;
  const facilities = facilitiesData.data;
  const times = timesData.data;

  const selectedTimes = times.filter(
    time => time.facility_id === selectedFacilityId
  );

  return (
    <>
      <select
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        value={selectedFacilityId ?? 'null'}
        onChange={e => setSelectedFacilityId(parseInt(e.target.value))}
      >
        <option value="null" disabled>
          Select a facility
        </option>
        {facilities.map(facility => (
          <option value={facility.id} key={facility.id}>
            {facility.name}
          </option>
        ))}
      </select>
      {selectedFacilityId !== null &&
        selectedTimes.map(time => (
          <UpdateOpeningHourForm key={time.id} timeId={time.id} />
        ))}
    </>
  );
};

const daysOfTheWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const UpdateOpeningHourForm: FC<{
  timeId: number;
}> = ({timeId}) => {
  const {token} = useAuth();
  const timeData = useGetFacilityTimeQuery(timeId);
  const [updateFacility] = useUpdateFacilityTimeMutation();
  const time = timeData.data;

  if (!time) return null;

  const todayMorning = dayjs()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);
  const formattedOpen = todayMorning
    .add(time.opening_time, 'minutes')
    .format('HH:mm');
  const formattedClose = todayMorning
    .add(time.closing_time, 'minutes')
    .format('HH:mm');

  return (
    <Formik
      enableReinitialize
      initialValues={{
        day: time.day,
        open: formattedOpen,
        close: formattedClose,
      }}
      onSubmit={async (values, actions) => {
        const {close, day, open} = values;
        const openingTime = dayjs(open, 'HH:mm').diff(todayMorning, 'minutes');
        const closingTime = dayjs(close, 'HH:mm').diff(todayMorning, 'minutes');

        await toast.promise(
          updateFacility({
            id: timeId,
            day,
            opening_time: openingTime,
            closing_time: closingTime,
            token: token!,
          }),
          {
            loading: 'Updating opening hours...',
            success: 'Opening hours updated',
            error: 'Something went wrong',
          }
        );
        actions.setSubmitting(false);
      }}
    >
      <Form className="flex gap-3">
        <FormField label="Day" required name="day" as="select">
          {daysOfTheWeek.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </FormField>
        <FormField label="Opening" required name="open" type="time" />
        <FormField label="Closing" required name="close" type="time" />
        <Button type="submit" intent="primary">
          Update
        </Button>
      </Form>
    </Formik>
  );
};
