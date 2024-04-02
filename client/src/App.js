import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Message from "./pages/messages/Message"; // Import Messages component
import Community from "./pages/community/Community"; // Import Community component
import Feedback from "./pages/feedback/Feedback"; // Import Feedback component
import Reports from "./pages/reports/Reports"; // Import Reports component
import MyRequest  from "./pages/myRequests/myRequest.jsx";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const queryClient = new QueryClient();

  const Layout = () => {
    const { pathname } = useLocation(); // Get current location
  
    // Defining an array of paths where you want to display the right bar
    const displayRightBarPaths = ["/", "/profile/:id", "/myrequests"];
  
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            {displayRightBarPaths.includes(pathname) && <RightBar />}
          </div>
        </div>
      </QueryClientProvider>
    );
  };
  

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/messages",
          element: <Message />,
        },
        {
          path: "/community",
          element: <Community />,
        },
        {
          path: "/myrequests",
          element: <MyRequest/>,
        },
        {
          path: "/feedback",
          element: <Feedback />,
        },
        {
          path: "/reports",
          element: <Reports />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
