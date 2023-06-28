import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashLayout from "./components/DashLayout";
import DashMenu from "./components/DashMenu";
import Layout from "./components/Layout";
import Public from "./components/Public";
import { ROLES } from "./config/roles";
import Login from "./features/auth/Login";
import RequireAuth from "./features/auth/RequireAuth";
import EditNote from "./features/notes/EditNote";
import NewNoteForm from "./features/notes/NewNoteForm";
import NotesList from "./features/notes/NotesList";
import EditProfile from "./features/users/EditProfile";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import Register from "./features/auth/Register";
import UsersList from "./features/users/UsersList";
import useTitle from "./hooks/useTitle";
import ThemeProvider from "./theme";

function App() {
  // Custom hook to set the page title
  useTitle("Meganote");

  return (
    <ThemeProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected Routes */}

          {/* All roles (logged in users) are allowed to access the wrapped routes */}
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            {/* If someone is not authorized, we're not going to prefetch the data, so we wrap 'RequireAuth' around 'Prefect' */}

            {/* Dash */}
            <Route path="dash" element={<DashLayout />}>
              {/* Only admins are allowed to access the users route */}
              <Route path="menu" element={<DashMenu />} />
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>
              </Route>

              <Route path="account">
                <Route index path=":id" element={<EditProfile />} />
              </Route>

              <Route path="notes">
                <Route index element={<NotesList />} />
                <Route path=":id" element={<EditNote />} />
                <Route path="new" element={<NewNoteForm />} />
              </Route>
            </Route>
            {/* End Dash */}
          </Route>
        </Route>
        {/* End Protected Routes */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
