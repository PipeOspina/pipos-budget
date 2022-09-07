import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Button, Collapse } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TModule } from '~/types';
import { trimChar } from '~/utils';

type Props = TModule & {
  buttonMargin?: number;
};

const subModulesPathInLocationFinder = (
  subModule: TModule,
  path: string,
  locationPath: string,
): boolean => {
  const subPath = `${path}/${trimChar(subModule.path ?? '', '/')}`;
  if (subPath === locationPath) return true;
  return Boolean(
    subModule.subModules?.length &&
      subModule.subModules.find((subSubModule) =>
        subModulesPathInLocationFinder(subSubModule, subPath, locationPath),
      ),
  );
};

export const LayoutModule: FC<Props> = ({ icon, label, buttonMargin, path, subModules }) => {
  const [showSubModules, setShowSubmodules] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const expandIcon = showSubModules ? <ExpandLess /> : <ExpandMore />;

  const trimmedLocationPath = useMemo(() => trimChar(location.pathname, '/'), [location]);

  const isLocationInPath = trimmedLocationPath === path;
  const isLocationInSubModules = useMemo(
    () =>
      Boolean(
        subModules?.length &&
          subModules.find((subModule) =>
            subModulesPathInLocationFinder(subModule, path ?? '', trimmedLocationPath),
          ),
      ),
    [subModules, path, trimmedLocationPath],
  );

  const handleClickModule = () => {
    setShowSubmodules((current) => !current);
    if (path !== undefined && !subModules?.length) navigate(path);
  };

  useEffect(() => {
    isLocationInSubModules && setShowSubmodules(isLocationInSubModules);
  }, [isLocationInSubModules]);

  return (
    <Box mt={1}>
      <Button
        startIcon={icon}
        endIcon={subModules?.length ? expandIcon : undefined}
        onClick={handleClickModule}
        sx={{
          width: (theme) => `calc(100% - ${theme.spacing(buttonMargin || 0)})`,
          bgcolor: isLocationInPath ? `${lightBlue[50]} !important` : undefined,
          marginLeft: buttonMargin,
          display: 'flex',
          justifyContent: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
          ['& .MuiButton-endIcon']: {
            marginLeft: 'auto',
          },
        }}
      >
        {label}
        {!subModules?.length && (
          <Box
            position="absolute"
            right={0}
            bgcolor={(theme) => theme.palette.primary.light}
            width={6}
            height="100%"
            sx={{
              width: (theme) => (isLocationInPath ? theme.spacing(0.7) : 0),
              transition: (theme) =>
                `width ${
                  theme.transitions.duration[isLocationInPath ? 'leavingScreen' : 'enteringScreen']
                }ms`,
            }}
          />
        )}
      </Button>
      <Collapse in={showSubModules}>
        <Box mb={!buttonMargin ? 2 : undefined}>
          {subModules?.map((subModule, i) => {
            const subPath = `${path}/${trimChar(subModule.path ?? '', '/')}`;
            const key = `LAYOUT_MODULE_${subPath.replaceAll('/', '_')}_${i}`;
            return (
              <LayoutModule
                {...subModule}
                path={subPath}
                buttonMargin={(buttonMargin ?? 0) + 2}
                key={key}
              />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};
