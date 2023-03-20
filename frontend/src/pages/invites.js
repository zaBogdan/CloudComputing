import useSWR from "swr";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Modal,
  Paper,
  CardContent,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { InvitesTable } from "src/sections/invites/invites-table";
import { InvitesSearch } from "src/sections/invites/invites-search";
import { applyPagination } from "src/utils/apply-pagination";
import { useFormik } from "formik";
import { authenticatedPostRequest } from "src/utils/requests";
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const useInvites = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, error, isLoading } = useSWR("/user/invites");
  const invites = useInvites(data?.data || [], page, rowsPerPage);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      expireIn: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email().max(255).required("Email is required"),
      expireIn: Yup.string().max(255).required("ExpireIn is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const data = await authenticatedPostRequest(`/user/invites`, {
          email: values.email,
          expireIn: values.expireIn,
        });
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        helpers.setValues({ email: '', expireIn: '' })
        helpers.resetForm();
        helpers.setFieldTouched('email', false);
        helpers.setFieldTouched('expireIn', false);
        toast.success("Invite create successfully");
        handleCloseModal();
      } catch (err) {
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
        <title>PGround | Invites</title>
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
                <Typography variant="h4">Invites</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleOpenModal}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <InvitesSearch />
            <InvitesTable
              count={data?.data?.length || 0}
              items={invites}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container
          maxWidth="sm"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
          }}
        >
          <Paper
            elevation={12}
            rounded={2}
            style={{
              backgroundColor: "rgb(255, 255, 255)",
              color: "rgb(17, 25, 39)",
              transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              borderRadius: "8px",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 5px 22px",
              backgroundImage: "none",
            }}
          >
            <CardContent>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  paddingLeft: "24px",
                }}
              >
                <Typography variant="h6">Create a new invitation</Typography>
                <Divider
                  sx={{
                    margin: "16px",
                  }}
                />
                <form noValidate onSubmit={formik.handleSubmit}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    sx={{
                      marginBottom: "16px",
                    }}
                  />
                  <TextField
                    error={!!(formik.touched.expireIn && formik.errors.expireIn)}
                    fullWidth
                    helperText={formik.touched.expireIn && formik.errors.expireIn}
                    label="Expire In"
                    name="expireIn"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.expireIn}
                    sx={{
                      marginBottom: "16px",
                    }}
                  />
                  <Divider
                    sx={{
                      margin: "16px",
                    }}
                  />
                  {formik.errors.submit && (
                    <Typography color="error" sx={{ mt: 3 }} variant="body2">
                      {formik.errors.submit}
                    </Typography>
                  )}
                  <Box>
                    <Button
                      color="primary"
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={formik.handleSubmit}
                    >
                      Create
                    </Button>
                  </Box>
                </form>
              </Grid>
            </CardContent>
          </Paper>
        </Container>
        {/* <Box sx={style}>
        </Box> */}
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
