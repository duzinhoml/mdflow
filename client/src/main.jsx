import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'

import Home from './pages/Home.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className='alert alert-danger' role='alert'>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
