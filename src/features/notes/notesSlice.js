import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  error: null,
  currentPageNotes: [],
  notesById: {},
  totalPages: 1,
  selectedNote: null,
  notes: [],
};

const slice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getAllNotesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const notes = action.payload;
      state.notes = notes;
    },

    getNotesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { notes, count, totalPages } = action.payload;
      notes.forEach(note => (state.notesById[note._id] = note));
      state.currentPageNotes = notes.map(note => note._id);
      state.totalNotes = count;
      state.totalPages = totalPages;
    },

    getNoteSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.selectedNote = action.payload;
    },

    updateNoteSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    deleteNoteSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    deleteNoteNotSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export default slice.reducer;

export const getAllNotes = () => async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get("/notes/all");
    dispatch(slice.actions.getAllNotesSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getNotes =
  ({ filterName, filterCompleted, page = 1, limit = 12 }) =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    if (filterName) {
      try {
        const params = { page, limit };

        const hasNumber = myString => {
          return /\d/.test(myString);
        };

        if (hasNumber(filterName)) {
          params.ticket = parseInt(filterName);
        } else {
          params.term = filterName;
        }

        if (filterCompleted) {
          params.status = "Completed";
        }
        const response = await apiService.get("/notes", { params });
        dispatch(slice.actions.getNotesSuccess(response));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
        const params = { page, limit };
        if (filterCompleted) {
          params.status = "Completed";
        }
        const response = await apiService.get("/notes", { params });
        dispatch(slice.actions.getNotesSuccess(response));
      }
    } else {
      try {
        const params = { page, limit };

        if (filterCompleted) {
          params.status = "Completed";
        }
        const response = await apiService.get("/notes", { params });
        dispatch(slice.actions.getNotesSuccess(response));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
      }
    }
  };

export const getNote = id => async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/notes/${id}`);
    dispatch(slice.actions.getNoteSuccess(response));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
