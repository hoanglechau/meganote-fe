import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FTextField, FormProvider } from "../../components/form";
import useAuth from "../../hooks/useAuth";
import { storage } from "../../utils/firebase";
import ImageButton from "../../components/ImageButton";

const UserSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(3, "Minimum 3 letters")
    .max(20, "Maximum 20 letters")
    .matches(/^[a-z\s]+$/i, "Only letters are allowed")
    .required("Full name is required"),
});

/**
 * @description Edit profile form
 * @param {object} user - User object
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const EditProfileForm = ({ user }) => {
  const auth = useAuth();

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(user.user.avatarUrl);

  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmitImage = () => {
    const imageRef = ref(storage, `avatars/${user.user.username}`);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then(url => {
            setUrl(url);
          })
          .catch(error => {
            toast.error(error.message);
          });
        setImage(null);
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  const defaultValues = {
    fullname: user.user.fullname,
  };

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSaveUserClicked = async data => {
    const { fullname } = data;
    try {
      await auth.updateProfile(
        {
          id: user.user._id,
          fullname,
          avatarUrl: url,
        },
        () => {
          navigate("/dash/notes");
        }
      );
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "87vh",
        maxHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, sm: 5, lg: 2.5 },
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 5 },
          border: "1px solid #ccc",
          boxShadow: "none",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Box component="div">
          <Typography
            variant="h4"
            color="primary"
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.5rem", sm: "2.5rem", lg: "2.5rem" },
            }}
          >
            Edit Profile
          </Typography>
        </Box>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Avatar
            alt="User Avatar"
            src={url}
            variant="rounded"
            sx={{
              width: { xs: "12rem", sm: "20rem", lg: "9rem" },
              height: { xs: "12rem", sm: "20rem", lg: "9rem" },
              mt: { xs: 0, lg: 2 },
              mb: { xs: 1, sm: 1, lg: 0 },
            }}
          />
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <ImageButton
              text="Choose File"
              hidden={true}
              onChange={handleImageChange}
              sx={{ display: { xs: "block", sm: "none" } }}
            />

            <ImageButton
              text=""
              hidden={false}
              onChange={handleImageChange}
              sx={{ display: { xs: "none", sm: "block" } }}
            />

            <Button
              variant="contained"
              size="medium"
              onClick={handleSubmitImage}
            >
              Upload
            </Button>
          </Box>
        </Box>
        <Box component="div">
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSaveUserClicked)}
          >
            <Stack spacing={2}>
              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}

              <FTextField name="fullname" label="Full Name" />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfileForm;
