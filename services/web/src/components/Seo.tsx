import type {NextSeoProps} from 'next-seo';
import {NextSeo} from 'next-seo';
import type {FC} from 'react';

const Seo: FC<NextSeoProps> = props => {
  return (
    <NextSeo
      defaultTitle="Sports Centre"
      titleTemplate="%s | A Sports Centre"
      {...props}
    />
  );
};

export default Seo;
