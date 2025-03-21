import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  Home,
  Login,
  SignUp,
  Video,
  Dashboard,
  CategorySelection,
  VoteNow,
  NotFound,
  ContactUs,
  Terms,
  ThankYou,
  ProtectedRoute,
  PaymentStatus
} from './components'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<NotFound />}>
      <Route path='' element={<Home />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<SignUp />} />
      <Route
        path='/video'
        element={
          <ProtectedRoute>
            <Video />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/categories'
        element={
          <ProtectedRoute>
            <CategorySelection />
          </ProtectedRoute>
        }
      />
      <Route
        path='/votenow'
        element={
          <ProtectedRoute>
            <VoteNow />
          </ProtectedRoute>
        }
      />
      <Route
        path='/thankyou'
        element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        }
      />
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/terms-and-conditions' element={<Terms />} />
      <Route path="/payment-status" element={<PaymentStatus />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <RouterProvider router={router} />
  </HelmetProvider>
)
