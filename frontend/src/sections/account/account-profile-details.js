import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "src/hooks/use-auth";
import { authenticatedGetRequest, authenticatedPutRequest } from "src/utils/requests";

const states = [
  {
    value: "is",
    label: "Iasi",
  },
  {
    value: "bt",
    label: "Botosani",
  },
  {
    value: "sv",
    label: "Suceava",
  },
  {
    value: "vs",
    label: "Vaslui",
  },
];

export const AccountProfileDetails = (props) => {
  const auth = useAuth();
  const [values, setValues] = useState({
    init: false,
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    date: Date.now(),
    state: 'is',
    country: 'RO',
  });

  const formik = useFormik({
    initialValues: values,
    enableReinitialze: true,
    validationSchema: Yup.object({
      firstName: Yup.string().max(255).required("First name is required"),
      lastName: Yup.string().max(255).required("Last name is required"),
      bio: Yup.string().max(255).required("Bio is required"),
      state: Yup.string().max(255).required("State is required"),
      country: Yup.string().max(255).required("Country is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const data = await authenticatedPutRequest(
          `/user/${auth.user.username}/profile`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            bio: values.bio,
            contact: [
              {
                "social": "linkedin",
                "link": "https://linkedin.com/u/zabogdan2"
            },
            {
                "social": "email",
                "link": "mailto:bzavadovschi@bitdefender.biz"
            }
            ]
          }
        );
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success("Profile updated successfully");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        toast.error(err?.response?.data?.error?.message || err.message);
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (values.init === true) return;
    const data = async () => {
      try {
        console.log(auth.user);
        const response = await authenticatedGetRequest(
          `/user/${auth.user.username}/profile`
        );
        console.log(response);
        console.log({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          bio: response.data.bio,
        })
        setValues({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          bio: response.data.bio,
          init: true,
        });
      } catch (error) {
        toast.error(error?.response?.data?.error?.message || error.message);
      }
    };
    data();
  }, [values]);

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <form noValidate onSubmit={formik.handleSubmit}>
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    helperText="Please specify the first name"
                    label="First name"
                    name="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    value={formik.values.firstName}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last name"
                    name="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    value={formik.values.lastName}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    value={formik.values.email}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Biography"
                    name="bio"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    value={formik.values.bio}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    value={formik.values.country}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Select State"
                    name="state"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.state}
                  >
                    {states.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={formik.handleSubmit}>Save details</Button>
          </CardActions>
        </form>
      </Card>
    </form>
  );
};
