import { Button } from "@mui/material";

/**
 * @description A button component that lets users browse their computers for images
 * @param {string} text
 * @param {boolean} hidden
 * @param {function} onChange
 * @param {object} other
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const ImageButton = ({ text, hidden, onChange, ...other }) => {
  return (
    <Button variant="contained" size="medium" component="label" {...other}>
      {text}
      <input
        className="image-input"
        type="file"
        hidden={hidden}
        onChange={onChange}
      />
    </Button>
  );
};

export default ImageButton;
