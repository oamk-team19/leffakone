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
import { GroupPage } from './views/GroupPage';
import { ThemeProvider } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { getRosyTheme } from './theme.js';
import { ColorModeContext } from './context/themeContext.js';

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
        path: '/group/:id',
        element: <GroupPage />,
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

function App() {
  // Try to load mode from localStorage, otherwise default to 'dark'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'moon';
  });

  const colorMode = useMemo(
    () => ({
      // This function will now take the new mode as an argument
      toggleColorMode: (event, newMode) => {
        // newMode will be 'light', 'dark', or 'moon' from ToggleButtonGroup
        if (newMode !== null) {
          // ToggleButtonGroup sends null if unselected, but we always want a selection
          setMode(newMode);
        }
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => getRosyTheme(mode), [mode]);

  return (
    <StrictMode>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </StrictMode>
  );
}

// Render the app
createRoot(document.getElementById('root')).render(<App />);
