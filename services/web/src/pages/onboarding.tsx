import clsx from 'clsx';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import type {FC, PropsWithChildren} from 'react';
import {useState} from 'react';
import * as yup from 'yup';
import AppIcon from '~/components/AppIcon/AppIcon';
import Button from '~/components/Button';
import Typography from '~/components/Typography';
import type {NextPageWithLayout} from '~/types/NextPage';

const onboardingSteps = [
  {
    title: 'Personal Details',
    why: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque expedita quod, tempora ullam quaerat pariatur. Quaerat culpa facere laborum numquam voluptates autem! A veniam quidem eaque incidunt quas, error modi!',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        required: true,
      },
      {
        name: 'middleName',
        label: 'Middle Name(s)',
        required: false,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        required: true,
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        required: true,
      },
      {
        name: 'phoneNumber',
        label: 'Phone Number',
        required: false,
      },
    ],
    validationSchema: yup.object({
      firstName: yup.string().required('First name is required'),
      middleName: yup.string(),
      lastName: yup.string().required('Last name is required'),
      dateOfBirth: yup.string().required('Date of birth is required'),
      phoneNumber: yup.string(),
    }),
  },
  {
    title: 'Emergency Contact',
    why: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque expedita quod, tempora ullam quaerat pariatur. Quaerat culpa facere laborum numquam voluptates autem! A veniam quidem eaque incidunt quas, error modi!',
    fields: [
      {
        name: 'emergencyPreferredName',
        label: 'Preferred Name',
        required: false,
      },
      {
        name: 'emergencyPhoneNumber',
        label: 'Phone Number',
        required: false,
      },
      {
        name: 'emergencyEmail',
        label: 'Email Address',
        required: false,
      },
    ],
    validationSchema: yup.object({
      emergencyPreferredName: yup.string(),
      emergencyPhoneNumber: yup.string(),
      emergencyEmail: yup.string().email('Is this an email?'),
    }),
  },
  {
    title: 'Mysteries has arisen',
    fields: [],
    validationSchema: yup.object({}),
  },
];

const OnboardingPage: NextPageWithLayout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const step = onboardingSteps[currentStep - 1];

  if (!step) return <>Something went wrong</>;

  const previousStep = () => setCurrentStep(Math.max(1, currentStep - 1));
  const nextStep = () =>
    setCurrentStep(Math.min(onboardingSteps.length, currentStep + 1));

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === onboardingSteps.length;

  return (
    <div className="flex grow">
      <aside className="bg-auth bg-cover bg-center p-16">
        <div className="flex h-full flex-col">
          <div className="grow">
            <AppIcon />
          </div>
          <Typography.p styledAs="data">Step {currentStep}</Typography.p>
          <Typography.h2>{step.title}</Typography.h2>
          <OnboardingStepper
            steps={onboardingSteps.length}
            currentStep={currentStep}
          />
        </div>
      </aside>
      <main className="grow bg-white py-16 px-8 text-black">
        <div className="container flex h-full flex-col">
          <Typography.h1 uppercase>{step.title}</Typography.h1>
          <div className="grid grow grid-cols-2 items-start gap-6">
            <Formik
              initialValues={{undefined}}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
              }}
              validationSchema={step.validationSchema}
            >
              <Form className="flex grow flex-col gap-3">
                {step.fields.map(field => (
                  <OnboardingField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    required={field.required}
                  />
                ))}
              </Form>
            </Formik>
            {step.why && <OnboardingWhyBox>{step.why}</OnboardingWhyBox>}
          </div>
          <div className="flex justify-between">
            <Button
              intent="primary"
              onClick={previousStep}
              className={clsx(isFirstStep && 'opacity-10')}
            >
              Previous
            </Button>
            <Button intent="primary" onClick={nextStep}>
              {isLastStep ? 'Finish' : 'Next'}
            </Button>
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
