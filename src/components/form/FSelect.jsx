import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/**
 * @description A select component that works with react-hook-form
 * @param {string} name
 * @param {*} children
 * @param {object} other
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function FSelect({ name, children, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

export default FSelect;
