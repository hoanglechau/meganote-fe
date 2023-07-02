import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { getAllUsers } from "../users/usersSlice";
import EditNoteForm from "./EditNoteForm";
import { getNote } from "./notesSlice";

/**
 * @description The Edit Note page
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const EditNote = () => {
  // Custom hook to set the title of the page
  useTitle("Meganote: Edit Note");

  const { isLoading } = useSelector(state => state.notes);

  const dispatch = useDispatch();
  // Get user id parameter out of the URL
  const { id } = useParams();
  const { selectedNote } = useSelector(state => state.notes);
  const { user } = useAuth();
  const { users } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(getNote(id));
    dispatch(getAllUsers());
  }, []);

  // If there is no note or no users, show a loading spinner
  if (isLoading || !selectedNote || !users?.length) return <LoadingScreen />;

  // Content to be rendered
  const content = <EditNoteForm note={selectedNote} users={users} />;

  return content;
};

export default EditNote;
