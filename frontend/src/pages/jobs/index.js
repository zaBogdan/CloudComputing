import useSWR from 'swr'
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { JobsTable } from 'src/sections/jobs/jobs-table';
import { JobsSearch } from 'src/sections/jobs/jobs-search';
import { applyPagination } from 'src/utils/apply-pagination';

const useJobs = (data, page, rowsPerPage) => {

  return useMemo(
    () => {
      if (!data) return [];
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, error, isLoading } = useSWR('/jobs');
  const jobs = useJobs(data?.data, page, rowsPerPage);
  console.log(data?.data)
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );



  return (
    <>
      <Head>
        <title>
          PGround | Jobs
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Jobs
                </Typography>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={() => router.push('/jobs/create')}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <JobsSearch />
                <JobsTable
                  count={data?.data?.length || 0}
                  items={jobs}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
