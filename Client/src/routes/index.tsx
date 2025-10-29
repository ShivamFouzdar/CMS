import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
// import { Home } from '@/pages/Home';
// import { ServicesPage } from '@/pages/Services';
// import { AboutPage } from '@/pages/About';
// import { ContactPage } from '@/pages/Contact';
// import { Reviews } from '@/pages/Reviews';
// import { DevToolsDemo } from '@/pages/DevToolsDemo';
import { ErrorPage } from '@/pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     index: true,
    //     element: <Home />,
    //   },
    //   {
    //     path: 'services',
    //     element: <ServicesPage />,
    //   },
    //   {
    //     path: 'about',
    //     element: <AboutPage />,
    //   },
    //   {
    //     path: 'contact',
    //     element: <ContactPage />,
    //   },
    //   {
    //     path: 'reviews',
    //     element: <Reviews />,
    //   },
    //   {
    //     path: 'dev-tools',
    //     element: <DevToolsDemo />,
    //   },
    // ],
  },
]);
