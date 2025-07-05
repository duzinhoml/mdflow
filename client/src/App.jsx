import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

import { Outlet } from 'react-router-dom';
import AppProviders from './AppProviders.jsx';

function App() {

  return (
    <>
      <AppProviders>
        <Outlet />
      </AppProviders>
    </>
  )
}

export default App;
