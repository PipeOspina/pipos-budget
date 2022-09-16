import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { Layout } from '~/components';
import { homePath, modules, routes } from '~/routes';
import { debts } from './cloud';

function App() {
  const Outlet = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();

  console.log(import.meta.env.VITE_EXAMPLE_KEY, import.meta.env.MODE);

  useEffect(() => {
    if (location.pathname === '/') navigate(homePath);
  }, [location, navigate]);

  useEffect(() => {
    debts
      .getDebts()
      .then(({ docs }) => console.log(docs))
      .catch(console.warn);
  }, []);

  return (
    <>
      <CssBaseline />
      <Layout modules={modules}>{Outlet}</Layout>
    </>
  );
}

export default App;
