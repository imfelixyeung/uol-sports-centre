import {useFormikContext} from 'formik';
import type {FC} from 'react';
import {useEffect} from 'react';

const FormikAutoSubmit: FC = () => {
  const context = useFormikContext();

  useEffect(() => {
    const handleValuesChange = async () => {
      if (await context.validateForm()) await context.submitForm();
    };
    void handleValuesChange();
  }, [context.values]); // only need to detect values change

  return null;
};

export default FormikAutoSubmit;
