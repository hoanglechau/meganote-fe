import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import useTitle from "../../hooks/useTitle";
import EditUserForm from "./EditUserForm";
import { getUser } from "./usersSlice";

/**
 * @description The Edit User page, with a form to edit the user's information
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const EditUser = () => {
  // Custom hook to set the page title
  useTitle("Meganote: Edit User");

  const { isLoading } = useSelector(state => state.users);

  const dispatch = useDispatch();
  // Get user id parameter out of the URL
  const { id } = useParams();
  const { selectedUser } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(getUser(id));
  }, []);

  if (isLoading || !selectedUser) return <LoadingScreen />;

  // Content to be rendered
  const content = <EditUserForm user={selectedUser} />;

  return content;
};

export default EditUser;
