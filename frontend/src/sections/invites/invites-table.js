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
import { InvitesDetails } from "./invites-details";

const Row = (props) => {
  const { invite, index } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover key={`invites-${invite.invite_code}-first-${index}`}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{invite.email}</Typography>
        </TableCell>
        <TableCell>
          {
              Math.floor((new Date(invite.expire_date).getTime() - (new Date()).getTime()) / 3600000)
          }
          {' '} hours
        </TableCell>
        <TableCell>{invite.active ? (
            <Chip
              label="Active"
              color="success"
              style={{ marginLeft: 1 }}
            />
        ) : (
            <Chip
              label="Inactive"
              color="error"
              style={{ marginLeft: 1 }}
            />
        )}</TableCell>
        <TableCell>{invite.invite_code}</TableCell>
      </TableRow>
      <TableRow key={`${invite._id}-second-${index}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <InvitesDetails invite={invite} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const InvitesTable = (props) => {
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
                <TableCell>Email</TableCell>
                <TableCell>Expires in</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((invite, index) => (
                <Row invite={invite} index={index} key={`invites-${invite.invite_code}-{index}`}/>
              ))}
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

InvitesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
