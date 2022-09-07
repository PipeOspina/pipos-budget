import { Box, Button, Link, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotFoundCat from '~/assets/illustrations/404Cat.svg';

export const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('');
  };

  return (
    <>
      <Box
        width="100%"
        height="calc(100vh - 150px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        p={2}
        sx={{
          ['&>*']: {
            mt: 2,
          },
          ['&>button']: {
            mt: 5,
          },
        }}
      >
        <img
          src={NotFoundCat}
          alt="404 - Not found sleeping cat"
          style={{ maxWidth: `calc(100vw - ${theme.spacing(4)})` }}
        />
        <Typography variant="h3" color="error">
          Oooopsi!
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography textAlign="center">
            La pagina a la que estás intentando ingresar, <strong>no existe</strong>
          </Typography>
          <Typography variant="body2" textAlign="center">
            Verifica la ruta/url de ingreso e intenta de nuevo más tarde
          </Typography>
        </Box>
        <Button variant="outlined" onClick={handleGoToHome} color="error">
          Ir al inicio
        </Button>
      </Box>
      <Box position="absolute" right={theme.spacing(3)} bottom={theme.spacing(3)}>
        <Typography variant="caption">
          Illustration designed by <strong>@freepik</strong> from{' '}
          <Link href="https://www.freepik.com/author/freepik" target="_blank">
            freepik.com
          </Link>
        </Typography>
      </Box>
    </>
  );
};
