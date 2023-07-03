import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingCircle from "../../components/LoadingCircle";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import NoteTable from "./NoteTable";
import { getNotes } from "./notesSlice";

/**
 * @description The Notes List page, with a table of all notes in the database
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const NotesList = () => {
  useTitle("Meganote: Notes List");

  const { user } = useAuth();

  const [filterName, setFilterName] = useState("");
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    handleSubmit(searchQuery);
    setSearchQuery("");
  };

  const handleChangeQuery = e => {
    setSearchQuery(e.target.value);
  };

  // Debounce for search input
  const debouncedResults = useMemo(() => {
    return debounce(handleChangeQuery, 600);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const { isLoading, currentPageNotes, notesById, totalNotes } = useSelector(
    state => state.notes
  );
  const notes = currentPageNotes.map(noteId => notesById[noteId]);
  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = searchQuery => {
    setFilterName(searchQuery);
  };

  useEffect(() => {
    setFilterName(searchQuery);
  }, [searchQuery]);

  // Filter inactive notes

  const handleFilterCompleted = () => {
    setFilterCompleted(!filterCompleted);
  };

  useEffect(() => {
    dispatch(
      getNotes({
        filterName,
        filterCompleted,
        page: page + 1,
        limit: rowsPerPage,
      })
    );
  }, [filterName, filterCompleted, page, rowsPerPage, dispatch]);

  let filteredNotes = notes;
  // Employees can only see their own notes
  if (user.role === "Employee") {
    filteredNotes = notes.filter(note => note.user === user._id);
  }
  // Managers cannot see Admins' notes, but can see all other notes
  if (user.role === "Manager") {
    filteredNotes = notes.filter(note => note.role !== "Admin");
  }

  let noteTable = null;
  if (isLoading) {
    noteTable = <LoadingCircle />;
  } else {
    noteTable = <NoteTable notes={filteredNotes} />;
  }

  return (
    <Container
      sx={{
        p: { xs: 3, sm: 5, lg: 2.5 },
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{
            mt: { xs: 0, md: 0 },
            mb: { xs: 1, md: 3 },
            textAlign: "center",
            fontSize: { xs: "1.5rem", sm: "2.5rem", lg: "2.5rem" },
          }}
        >
          Notes List
        </Typography>
        <Card sx={{ p: { xs: 1.5, sm: 3, lg: 3 }, boxShadow: "none" }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center">
              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContents: "center",
                  alignItems: "center",
                }}
              >
                <form onSubmit={onSubmit}>
                  <TextField
                    placeholder="Search notes..."
                    onChange={debouncedResults}
                    sx={{ width: { xs: "100%", md: "300px" } }}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            color="primary"
                            aria-label="search"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>

                <Typography
                  variant="subtitle"
                  sx={{
                    ml: 2,
                    display: { xs: "none", lg: "flex" },
                  }}
                >
                  {totalNotes > 1
                    ? `${totalNotes} notes found`
                    : totalNotes === 1
                    ? `${totalNotes} note found`
                    : "No note found"}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />
              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContents: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle">Hide completed</Typography>
                <Switch
                  checked={filterCompleted}
                  onChange={handleFilterCompleted}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <TablePagination
                sx={{
                  "& .MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
                    {
                      display: { xs: "none", lg: "flex" },
                    },
                }}
                component="div"
                count={totalNotes ? totalNotes : 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
            {noteTable}
          </Stack>
        </Card>
      </Paper>
    </Container>
  );
};

export default NotesList;
