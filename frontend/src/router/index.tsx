import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import MobileLoading from '../components/MobileLoading';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorPage from '../pages/ErrorPage';
import TestContentful from '../components/TestContentful';

// Lazy load delle pagine per ottimizzazione mobile
const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const SkillsPage = lazy(() => import('../pages/SkillsPage'));
const CertificationsPage = lazy(() => import('../pages/CertificationsPage'));
const StatisticsPage = lazy(() => import('../pages/StatisticsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

// Utility function per wrappare le pagine lazy con Suspense ed ErrorBoundary
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <ErrorBoundary>
    <Suspense fallback={<MobileLoading message="Caricamento pagina..." />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'about',
        element: withSuspense(AboutPage),
      },
      {
        path: 'projects',
        element: withSuspense(ProjectsPage),
      },
      {
        path: 'blog',
        element: withSuspense(BlogPage),
      },
      {
        path: 'blog/:slug',
        element: withSuspense(BlogDetailPage),
      },
      {
        path: 'services',
        element: withSuspense(ServicesPage),
      },
      {
        path: 'servizi',
        element: withSuspense(ServicesPage),
      },
      {
        path: 'skills',
        element: withSuspense(SkillsPage),
      },
      {
        path: 'certifications',
        element: withSuspense(CertificationsPage),
      },
      {
        path: 'certificazioni',
        element: withSuspense(CertificationsPage),
      },
      {
        path: 'skills',
        element: withSuspense(SkillsPage),
      },
      {
        path: 'competenze',
        element: withSuspense(SkillsPage),
      },
      {
        path: 'statistics',
        element: withSuspense(StatisticsPage),
      },
      {
        path: 'contact',
        element: withSuspense(ContactPage),
      },
      {
        path: 'test-contentful',
        element: <TestContentful />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;