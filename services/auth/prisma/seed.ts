import {PrismaClient} from '@prisma/client';
import {UserRole} from '~/config';
import {registerWithCredentials} from '~/services/auth';
import {updateUserById} from '~/services/users';
const db = new PrismaClient();

const roles: UserRole[] = ['ADMIN', 'EMPLOYEE', 'USER'];
const PASSWORD = '6789Password9876';

const seed = async () => {
  const usersCount = await db.user.count();
  if (usersCount > 0) return console.log('Already previously seeded');

  const emails = roles.map(role => `${role}@example.com`.toLowerCase());

  const registrationPromises = emails.map(email =>
    registerWithCredentials({email, password: PASSWORD}, {rememberMe: false})
  );

  await Promise.all(registrationPromises);

  const users = await db.user.findMany();
  const updateRolePromises = users.map(user => {
    const rawRole = user.email.split('@')[0];

    if (!rawRole) throw new Error('Unexpected seeded email role');

    const role = rawRole.toUpperCase() as UserRole;
    return updateUserById(user.id, {role});
  });

  await Promise.all(updateRolePromises);
};

seed()
  .then(async () => {
    await db.$disconnect();
    console.log('Seed complete');
  })
  .catch(async error => {
    await db.$disconnect();
    throw error;
  });
