import React, { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Card,
  IconButton,
  Table,
  Chip,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Paper,
  TableContainer,
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Scrollbar } from "src/components/scrollbar";
import { JobDetails } from "./job-details";

export const JobsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Triggered By</TableCell>
                <TableCell>Latest Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((job, index) => {
                const createdAt = format(
                  new Date(job.lastUpdate),
                  "dd/MM/yyyy HH:mm:ss"
                );
                const [open, setOpen] = useState(false);
                return (
                  <React.Fragment key={`${job.id}-fragment-${index}`}>
                    <TableRow hover key={`${job.id}-first-${index}`}>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => setOpen(!open)}
                        >
                          {open ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {job.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {job.tags.map((tag, idx) => (
                          <Chip
                            key={`${tag}-${idx}`}
                            label={tag}
                            color="primary"
                            style={{ marginLeft: 1 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{job.triggeredBy}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                    </TableRow>
                    <TableRow key={`${job.id}-second-${index}`}>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <JobDetails job={job} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

JobsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
