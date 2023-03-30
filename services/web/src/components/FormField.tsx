import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import type {FC, PropsWithChildren, ReactHTML} from 'react';
import {useId} from 'react';

const FormField: FC<
  PropsWithChildren<{
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    as?: keyof ReactHTML;
    type?: string;
  }>
> = ({
  name,
  label,
  required = false,
  disabled = false,
  as: is,
  children,
  type,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const context = useFormikContext<Record<string, string>>();
  const id = useId();
  const htmlId = `${id}-${name}`;

  return (
    <label
      htmlFor={htmlId}
      className={clsx('flex grow flex-col', disabled && 'opacity-20')}
    >
      <span>
        {label}
        {required && '*'}
      </span>
      <Field
        id={htmlId}
        name={name}
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        disabled={disabled}
        as={is}
        type={type}
      >
        {children}
      </Field>
      {context.submitCount !== 0 && context.errors[name] && (
        <span className="text-red-600">{context.errors[name]}</span>
      )}
    </label>
  );
};

export default FormField;
