import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  ButtonBase,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import { FC, PropsWithChildren, useState } from 'react';
import { TModule } from '~/types';
import { LayoutModule } from './LayoutModule';

interface Props {
  modules: TModule[];
}

const drawerWidth = 250;

export const Layout: FC<PropsWithChildren<Props>> = ({ children, modules }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const [openDrawer, setOpenDrawer] = useState(!matches);

  return (
    <Box display="flex" maxWidth="100vw" height="100vh" bgcolor={grey[100]}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpenDrawer((current) => !current)}
          >
            {openDrawer ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <ButtonBase sx={{ borderRadius: '50%' }} color="primary">
            <Avatar alt="Felipe Ospina" src="https://foto.com" />
          </ButtonBase>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        open={openDrawer}
        anchor="left"
        variant={!matches ? 'persistent' : 'temporary'}
        sx={{
          width: { md: openDrawer ? drawerWidth : 0, xs: 0 }, // openDrawer && !matches ? drawerWidth : 0,
          transition: !matches
            ? `width ${
                theme.transitions.duration[openDrawer ? 'leavingScreen' : 'enteringScreen']
              }ms`
            : undefined,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Toolbar />
        <Box p={2}>
          {modules.map((module, i) => {
            const key = `LAYOUT_MODULE_CONTAINER_${module.path?.replaceAll('/', '_')}_${i}`;
            return <LayoutModule {...module} key={key} />;
          })}
        </Box>
      </SwipeableDrawer>
      <Box display="flex" flexDirection="column" width="100%">
        <Toolbar />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
