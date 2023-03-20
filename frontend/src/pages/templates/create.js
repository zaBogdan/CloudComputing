import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  CardActions,
  TextareaAutosize,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { authenticatedPostRequest } from "src/utils/requests";
import { ArrowBack } from "@mui/icons-material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

const Page = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: '',
      tags: '',
      parameters: '',
      substitute: '',
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Job name is required"),
      tags: Yup.string().max(255).required("At least one tag is required"),
      parameters: Yup.string().required("You must set the parameters here!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const data = await authenticatedPostRequest("/jobs/templates", {
          name: values.name,
          tags: values.tags.split(","),
          parameters: JSON.parse(values.parameters),
          substitute: JSON.parse(values.substitute)
        });
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        console.log(data);
        toast.success(`Successfully created a new template!`);
        router.push("/templates");
      } catch (err) {
        console.log('Error', err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        toast.error(err?.response?.data?.error?.message || err.message);
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>PGround | Add new Template</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Add a new template</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowBack />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push("/templates")}
                >
                  Back
                </Button>
              </div>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Card>
                <CardHeader subheader="Please fill in all the details" />
                <Divider />
                <CardContent>
                  <Grid container spacing={6} wrap="wrap">
                    <Grid xs={12} sm={6} md={8}>
                      <Stack spacing={1}>
                          <TextField
                            error={
                              !!(formik.touched.name && formik.errors.name)
                            }
                            fullWidth
                            helperText={
                              formik.touched.name && formik.errors.name
                            }
                            label="Name"
                            name="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.name}
                            sx={{
                              marginBottom: "16px",
                            }}
                          />
                          <TextField
                            error={
                              !!(formik.touched.tags && formik.errors.tags)
                            }
                            fullWidth
                            helperText={
                              formik.touched.tags && formik.errors.tags
                            }
                            label="Tags"
                            name="tags"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.tags}
                            sx={{
                              marginBottom: "16px",
                            }}
                          />
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={10}
                            label="Parameters"
                            name="parameters"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.parameters}
                            placeholder="Add here parameters object in JSON format"
                            sx={{
                                marginTop: '10px',
                                marginBottom: "16px",
                            }}
                        />
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={10}
                            label="Substitute"
                            name="substitute"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.substitute}
                            placeholder="Add here substitutes object in JSON format"
                            sx={{
                                marginTop: '10px',
                                marginBottom: "16px",
                            }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                {formik.errors.submit && (
					<Typography
						color="error"
						sx={{ mt: 3 }}
						variant="body2"
					>
						{formik.errors.submit}
					</Typography>
				)}
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button variant="contained" type="submit"
                  onClick={formik.handleSubmit}>Save</Button>
                </CardActions>
              </Card>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
