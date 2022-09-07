import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

export type TModule = RouteObject & {
  subModules?: TModule[];
  icon: ReactNode;
  label: string;
};
