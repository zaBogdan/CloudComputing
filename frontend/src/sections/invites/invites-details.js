import {
	TextField,
	Typography,
	CardContent,
	Grid,
	Button,
	FormControlLabel,
	Checkbox,
	Divider,
} from "@mui/material";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box } from "@mui/system";

import { authenticatedDeleteRequest, authenticatedPutRequest } from "src/utils/requests";

export const InvitesDetails = (props) => {
	const {
		invite
	} = props;
	const formik = useFormik({
    initialValues: {
      active: invite.active,
      submit: null
    },
    validationSchema: Yup.object({
		active: Yup
        .boolean()
        .required('active is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
		const data = await authenticatedPutRequest(`/user/invites/${invite.invite_code}`, {
			active: values.active,
		})
		helpers.setStatus({ success: true });
		helpers.setSubmitting(false);
		toast.success('Invite updated successfully')
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        toast.error(err?.response?.data?.error?.message || err.message)
        helpers.setSubmitting(false);
      }
    }
  });

	return (
		<CardContent>
			<Grid item xs={12} md={6} sx={{
				paddingLeft: '24px'
			}}>
				<Typography variant="h6">
					Invitation details
				</Typography>
				<Divider sx={{
					margin: '16px',
				}}/>
				<form
					noValidate
					onSubmit={formik.handleSubmit}
				>
				<FormControlLabel
                    control={<Checkbox 
						checked={formik.values.active}
						/>}
                    label="Active"
					name="active"
					value={formik.values.active}
					onBlur={formik.handleBlur}
					onChange={formik.handleChange}
                  />
				<Divider sx={{
					margin: '16px',
				}}/>
				{formik.errors.submit && (
					<Typography
						color="error"
						sx={{ mt: 3 }}
						variant="body2"
					>
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
						Save
					</Button>
					<Button
						color="danger"
						size="large"
						variant="outline"
						onClick={async () => {
							await authenticatedDeleteRequest(`/user/invites/${invite.invite_code}`)
						}}
						sx={{
							marginLeft: '16px'
						}}
					>
						Delete
					</Button>
				</Box>
				</form>

			</Grid>
		</CardContent>
	)
};

InvitesDetails.propTypes = {
	invite: PropTypes.object,
}