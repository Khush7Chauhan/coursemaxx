import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import UserSignIn from './pages/UserSignIn';
import UserSignUp from './pages/UserSignUp';
import MyPurchases from './pages/MyPurchase';
import AdminSignIn from './pages/adminSignin';
import AdminDashboard from './pages/adminDashboard';
import CreateCourse from './pages/createCourse';

function App() {
  return (
    <BrowserRouter>
      {/* A simple unstyled navigation bar */}
      <nav>
        <ul>
          <li><Link to="/">Home (Courses)</Link></li>
          <li><Link to="/signin">User Sign In</Link></li>
          <li><Link to="/purchases">My Purchases</Link></li>
          <li><Link to="/admin/signin">Admin Portal</Link></li>
        </ul>
      </nav>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />

        {/* User Routes */}
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/purchases" element={<MyPurchases />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignIn />} /> {/* Reusing or duplicating signin/signup for admin */}
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-course" element={<CreateCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;