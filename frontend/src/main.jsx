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
import NotFound from './views/NotFound';
import MainLayout from './Layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'showtime',
        element: <Showtime />,
      },
      {
        path: 'muidemo',
        element: <MuiDemo />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
