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
import NotFound from './views/NotFound';
import MainLayout from './Layouts/MainLayout';
import UserProvider from './context/UserProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { Profile } from './views/Profile';

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
      {
        path: '/movies/:id',
        element: <MovieInfo />,
      },
      {
        path: '/shows/:id',
        element: <Movies />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
