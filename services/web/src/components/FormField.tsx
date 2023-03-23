import clsx from 'clsx';
import {Field, useFormikContext} from 'formik';
import type {FC} from 'react';

const FormField: FC<{
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}> = ({name, label, required = false, disabled = false}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const context = useFormikContext<Record<string, string>>();

  return (
    <label
      htmlFor={name}
      className={clsx('flex grow flex-col', disabled && 'opacity-20')}
    >
      <span>
        {label}
        {required && '*'}
      </span>
      <Field
        id={name}
        name={name}
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        disabled={disabled}
      />
      {context.submitCount !== 0 && context.errors[name] && (
        <span className="text-red-600">{context.errors[name]}</span>
      )}
    </label>
  );
};

export default FormField;
