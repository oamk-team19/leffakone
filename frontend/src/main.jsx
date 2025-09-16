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
import UserProvider from  './context/UserProvider'
import ProtectedRoute from './components/ProtectedRoute';



const router = createBrowserRouter([
  {
    /* 
    
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: < App />,
      }
    ]
    
   
    path: '/',
    element: <MainPage />,

     
*/
    
    element: <ProtectedRoute />,
    children: [{
      path: "/",
      element: <MainPage />,
    }]

    
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
   </UserProvider>
  </StrictMode>
);
