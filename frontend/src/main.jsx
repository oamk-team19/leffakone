import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from './views/MainPage';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { Showtime } from './views/Showtime';
import { MuiDemo } from './views/MuiDemo';
import { MovieInfo } from './views/MovieInfo';
import { Movies } from './views/Shows';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/showtime',
    element: <Showtime />,
  },
  {
    path: '/muidemo',
    element: <MuiDemo />,
  },
    {
    path: '/movies/:id',
    element: <MovieInfo />,
  },
      {
    path: '/shows/:id',
    element: <Movies />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
