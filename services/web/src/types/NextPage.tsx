// Types for https://nextjs.org/docs/basic-features/layouts

import type {NextComponentType, NextPage} from 'next';
import type {ReactNode} from 'react';

interface WithGetLayout {
  getLayout?: (page: ReactNode) => ReactNode;
}

export type NextPageWithLayout<Props = {}> = NextPage<Props> & WithGetLayout;

export type NextComponentTypeWithLayout = NextComponentType & WithGetLayout;
