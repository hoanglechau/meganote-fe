import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

/**
 * @description A search input component
 * @param {function} handleSubmit
 * @param {string} placeholder
 * @param {object} other
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function SearchInput({ handleSubmit, placeholder, ...other }) {
  const [searchQuery, setSearchQuery] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    handleSubmit(searchQuery);
    setSearchQuery("");
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        value={searchQuery}
        placeholder={placeholder}
        onChange={event => setSearchQuery(event.target.value)}
        {...other}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" color="primary" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

export default SearchInput;
