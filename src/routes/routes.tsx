import { RouteObject } from 'react-router-dom';
import { NotFound } from '~/components';
import { routerizeModules } from '~/utils/routerizeModules';
import { modules } from './modules';

export const homePath = 'debts';

const routerizedModules = routerizeModules(modules);

export const routes: RouteObject[] = [
  ...routerizedModules,
  {
    element: <NotFound />,
    path: '*',
  },
];

export default routes;
