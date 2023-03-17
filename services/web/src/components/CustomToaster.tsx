import clsx from 'clsx';
import {AnimatePresence, motion} from 'framer-motion';
import {resolveValue, toast, Toaster, ToastIcon} from 'react-hot-toast';
import CrossIcon from './Icons/CrossIcon';
import Typography from './Typography';

const CustomToaster = () => {
  return (
    <AnimatePresence>
      <Toaster position="bottom-right">
        {t => {
          const {ariaProps, id, visible, className, type} = t;
          return (
            <motion.div
              key={id}
              id={`toast-${id}`}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: visible ? 1 : 0, y: 0}}
              className={clsx(
                'flex w-full max-w-sm flex-col gap-3 border-4 border-black bg-white p-8 text-black',
                className
              )}
              {...ariaProps}
            >
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center justify-between gap-3">
                  <ToastIcon toast={t} />
                  <Typography.h3 uppercase>{type} Alert</Typography.h3>
                </div>
                <button
                  type="button"
                  className="p-1"
                  onClick={() => toast.dismiss(id)}
                >
                  <CrossIcon className="h-4" />
                </button>
              </div>
              <Typography.p styledAs="smallP">
                {resolveValue(t.message, t)}
              </Typography.p>
            </motion.div>
          );
        }}
      </Toaster>
    </AnimatePresence>
  );
};

export default CustomToaster;
