import clsx from 'clsx';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import type {FC, PropsWithChildren} from 'react';
import AppIcon from '~/components/AppIcon/AppIcon';
import Button from '~/components/Button';
import Typography from '~/components/Typography';
import type {NextPageWithLayout} from '~/types/NextPage';

const OnboardingPage: NextPageWithLayout = () => {
  return (
    <div className="flex grow">
      <aside className="bg-auth bg-cover bg-center p-16">
        <div className="flex h-full flex-col">
          <div className="grow">
            <AppIcon />
          </div>
          <Typography.p styledAs="data">Step 1</Typography.p>
          <Typography.h2>Personal Details</Typography.h2>
          <OnboardingStepper steps={3} currentStep={1} />
        </div>
      </aside>
      <main className="grow bg-white py-16 px-8 text-black">
        <div className="container flex h-full flex-col">
          <Typography.h1 uppercase>Personal Details</Typography.h1>
          <div className="grid grow grid-cols-2 items-start gap-6">
            <Formik
              initialValues={{undefined}}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
              }}
            >
              <Form className="flex grow flex-col gap-3">
                <OnboardingField name="firstName" label="First Name" required />
                <OnboardingField name="middleName" label="Middle Name" />
                <OnboardingField name="lastName" label="Last Name" required />
                <OnboardingField name="dob" label="Date of Birth" required />
                <OnboardingField name="phoneNumber" label="Phone Number" />
              </Form>
            </Formik>
            <OnboardingWhyBox>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
              nisi, explicabo ea et nemo dolores blanditiis quisquam nostrum
              totam perferendis veritatis minus quo accusantium quos eveniet
              consequuntur nesciunt tenetur? Laboriosam.
            </OnboardingWhyBox>
          </div>
          <div className="flex justify-between">
            <Button intent="primary">Previous</Button>
            <Button intent="primary">Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

OnboardingPage.getLayout = page => (
  <div className="flex min-h-screen flex-col">{page}</div>
);

export default OnboardingPage;

const OnboardingWhyBox: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="bg-black p-6 text-white">
      <Typography.h2 uppercase>Why</Typography.h2>
      <Typography.p styledAs="smallP" className="mt-3">
        {children}
      </Typography.p>
    </div>
  );
};

const OnboardingStepper: FC<{
  steps: number;
  currentStep: number;
}> = ({steps, currentStep}) => {
  const label = `Step ${currentStep} out of ${steps}`;
  return (
    <div className="mt-6 flex gap-2" aria-label={label} title={label}>
      {Array.from({length: steps}).map((value, index) => {
        return (
          <div
            key={index}
            className={clsx(
              'h-2 grow',
              index < currentStep ? 'bg-primary' : 'bg-white'
            )}
          />
        );
      })}
    </div>
  );
};

const OnboardingField: FC<{
  name: string;
  label: string;
  required?: boolean;
}> = ({name, label, required = false}) => {
  return (
    <label htmlFor={name} className="flex grow flex-col">
      <span>
        {label}
        {required && '*'}
      </span>
      <Field
        id={name}
        name={name}
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
      />
      <span className="text-red-600">
        <ErrorMessage name={name} />
      </span>
    </label>
  );
};
