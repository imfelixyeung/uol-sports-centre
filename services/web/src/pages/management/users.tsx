import dayjs from 'dayjs';
import type {NextPage} from 'next';
import {useState} from 'react';
import Button from '~/components/Button';
import {EditUserRecordForm} from '~/components/EditUserRecordForm';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useGetAuthUsersQuery} from '~/redux/services/api';

const ManageUsersPage: NextPage = () => {
  const {token} = useAuth();
  const [page, setPage] = useState(0);
  const usersData = useGetAuthUsersQuery({token: token!, pageIndex: page});

  if (usersData.isLoading) return <>Loading...</>;
  if (usersData.isError || !usersData.data) return <>Something went wrong</>;

  const users = usersData.data.data;

  const prevPage = () => setPage(page => Math.max(page - 1, 0));
  const nextPage = () => {
    if (users.length === 0) return;
    setPage(page => page + 1);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center">
        <Button onClick={prevPage} intent="primary">
          Prev Page
        </Button>
        <>Page: {page}</>
        <Button onClick={nextPage} intent="primary">
          Next Page
        </Button>
      </div>
      {users.map(user => (
        <div key={user.id}>
          <Typography.h2>{user.id}</Typography.h2>
          <Typography.p styledAs="data">Email: {user.email}</Typography.p>
          <Typography.p styledAs="data">Role: {user.role}</Typography.p>
          <Typography.p styledAs="data">
            Joined: {dayjs(user.createdAt).fromNow()}
          </Typography.p>
          <Typography.p styledAs="data">
            Edited: {dayjs(user.updatedAt).fromNow()}
          </Typography.p>
          <EditUserRecordForm userId={user.id} />
        </div>
      ))}
      {users.length === 0 && <>This page is empty</>}
    </div>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(ManageUsersPage),
  {rolesAllowed: ['ADMIN', 'MANAGER']}
);
