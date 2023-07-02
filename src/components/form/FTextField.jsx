import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/**
 * @description A text field component that works with react-hook-form
 * @param {string} name
 * @param {object} other
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function FTextField({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}

export default FTextField;
