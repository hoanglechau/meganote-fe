import {
  Box,
  Card,
  Container,
  Paper,
  Stack,
  Switch,
  TablePagination,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingCircle from "../../components/LoadingCircle";
import SearchInput from "../../components/SearchInput";
import useTitle from "../../hooks/useTitle";
import UserTable from "./UserTable";
import { getUsers } from "./usersSlice";

/**
 * @description This component renders the page with a list of all users
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const UsersList = () => {
  useTitle("Meganote: Users List");

  const [filterName, setFilterName] = useState("");
  const [filterInactive, setFilterInactive] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { isLoading, currentPageUsers, usersById, totalUsers } = useSelector(
    state => state.users
  );
  const users = currentPageUsers.map(userId => usersById[userId]);
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

  // Filter inactive users

  const handleFilterInactive = () => {
    setFilterInactive(!filterInactive);
    setFilterName("");
  };

  useEffect(() => {
    dispatch(
      getUsers({
        filterName,
        filterInactive,
        page: page + 1,
        limit: rowsPerPage,
      })
    );
  }, [filterName, filterInactive, page, rowsPerPage, dispatch]);

  let userTable = null;
  if (isLoading) {
    userTable = <LoadingCircle />;
  } else {
    userTable = <UserTable users={users} />;
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
          Users List
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
                <SearchInput
                  handleSubmit={handleSubmit}
                  placeholder="Search users..."
                  sx={{ width: { xs: "100%", md: "300px" } }}
                />

                <Typography
                  variant="subtitle"
                  sx={{
                    ml: 2,
                    display: { xs: "none", lg: "flex" },
                  }}
                >
                  {totalUsers > 1
                    ? `${totalUsers} users found`
                    : totalUsers === 1
                    ? `${totalUsers} user found`
                    : "No user found"}
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
                <Typography
                  variant="subtitle"
                  sx={{
                    mt: { xs: 2, sm: 0 },
                    ml: { md: 3, lg: 1 },
                  }}
                >
                  Hide inactive
                </Typography>
                <Switch
                  checked={filterInactive}
                  onChange={handleFilterInactive}
                  sx={{ mt: { xs: 2, sm: 0 } }}
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
                count={totalUsers ? totalUsers : 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
            {userTable}
          </Stack>
        </Card>
      </Paper>
    </Container>
  );
};

export default UsersList;
