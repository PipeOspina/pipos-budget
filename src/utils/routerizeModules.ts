import { TModule } from '~/types';
import { trimChar } from './trimChars';

export const routerizeModules = (modules: TModule[]) => {
  const normalizeModule = (module: TModule, path?: string): TModule[] => {
    const trimmedPath = trimChar(module.path ?? '', '/');
    const newPath = path ? `${path}/${trimmedPath}` : trimmedPath;
    if (!module.subModules) return [{ ...module, path: newPath }];
    return [
      ...module.subModules.map((currentModule) => normalizeModule(currentModule, newPath)),
    ].flat();
  };

  return modules
    .map((module) => normalizeModule(module))
    .flat()
    .reverse();
};
