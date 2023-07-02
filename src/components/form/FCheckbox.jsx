import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/**
 * @description A checkbox component that works with react-hook-form
 * @param {string} name
 * @param {object} other
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function FCheckbox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

export default FCheckbox;
