import clsx from 'clsx';
import {Form, Formik} from 'formik';
import {useRouter} from 'next/router';
import type {FC, PropsWithChildren} from 'react';
import {useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import * as yup from 'yup';
import AppIcon from '~/components/AppIcon/AppIcon';
import useRedirectTo from '~/components/Auth/hooks/useRedirectTo';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {useUser} from '~/providers/user/hooks/useUser';
import {useCreateUserMutation} from '~/redux/services/api';
import type {NextPageWithLayout} from '~/types/NextPage';

interface OnboardingStep {
  title: string;
  why?: string;
  fields: {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
  }[];
  validationSchema: unknown;
}

const onboardingSteps: OnboardingStep[] = [
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
        disabled: true,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        required: true,
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        required: false,
        disabled: true,
      },
      {
        name: 'phoneNumber',
        label: 'Phone Number',
        required: false,
        disabled: true,
      },
    ],
    validationSchema: yup.object({
      firstName: yup.string().required('First name is required'),
      middleName: yup.string(),
      lastName: yup.string().required('Last name is required'),
      dateOfBirth: yup.string(),
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
        disabled: true,
      },
      {
        name: 'emergencyPhoneNumber',
        label: 'Phone Number',
        required: false,
        disabled: true,
      },
      {
        name: 'emergencyEmail',
        label: 'Email Address',
        required: false,
        disabled: true,
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
  const {token} = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [createUser] = useCreateUserMutation();
  const auth = useAuth();
  const {user} = useUser();
  const router = useRouter();
  const step = onboardingSteps[currentStep - 1];
  const redirectTo = useRedirectTo();

  useEffect(() => {
    if (!user) return;
    console.log({user});
    void router.push(redirectTo);
  }, [user, redirectTo, router]);

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
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
          }}
          onSubmit={async (values, actions) => {
            await actions.validateForm();
            if (!isLastStep) {
              actions.setSubmitting(false);
              nextStep();
              return;
            }

            await toast
              .promise(
                createUser({
                  id: auth.session!.user.id,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  token: token!,
                }).unwrap(),
                {
                  loading: 'Onboarding...',
                  success: 'Onboarding success!',
                  error: 'Something went wrong...',
                }
              )
              .then(() => void router.push('/dashboard'))
              .catch(() => null);

            actions.setSubmitting(false);
          }}
          validationSchema={step.validationSchema}
        >
          <Form className="container flex h-full flex-col">
            <Typography.h1 uppercase>{step.title}</Typography.h1>
            <div className="grid grow grid-cols-2 items-start gap-6">
              <div className="flex grow flex-col gap-3">
                {step.fields.map(field => (
                  <FormField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    required={field.required}
                    disabled={field.disabled}
                  />
                ))}
              </div>
              {step.why && <OnboardingWhyBox>{step.why}</OnboardingWhyBox>}
            </div>
            <div className="flex justify-between">
              <Button
                intent="primary"
                type="button"
                onClick={previousStep}
                className={clsx(isFirstStep && 'opacity-10')}
              >
                Previous
              </Button>
              <Button intent="primary" type="submit">
                {isLastStep ? 'Finish' : 'Next'}
              </Button>
            </div>
          </Form>
        </Formik>
      </main>
    </div>
  );
};

OnboardingPage.getLayout = page => (
  <div className="flex min-h-screen flex-col">{page}</div>
);

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

export default withPageAuthRequired(OnboardingPage);
