import {
	TextField,
	Typography,
	CardContent,
	Grid,
	Button,
	Divider,
} from "@mui/material";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box } from "@mui/system";

import { authenticatedDeleteRequest, authenticatedPutRequest } from "src/utils/requests";

export const TemplateDetails = (props) => {
	const {
		template
	} = props;
	const formik = useFormik({
    initialValues: {
      name: template.name,
      tags: template.tags.join(','),
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('name is required'),
			tags: Yup
        .string()
        .max(255)
        .required('Tags is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
		const data = await authenticatedPutRequest(`/jobs/templates/${template._id}`, {
			name: values.name,
			tags: values.tags.split(','),
		})
		helpers.setStatus({ success: true });
		helpers.setSubmitting(false);
		toast.success('Template updated successfully')
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
					template Details
				</Typography>
				<Divider sx={{
					margin: '16px',
				}}/>
				<form
					noValidate
					onSubmit={formik.handleSubmit}
				>
						<TextField
							error={!!(formik.touched.name && formik.errors.name)}
							fullWidth
							helperText={formik.touched.name && formik.errors.name}
							label="Name"
							name="name"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="text"
							value={formik.values.name}
							sx={{
								marginBottom: '16px'
							}}
						/>
						<TextField
							error={!!(formik.touched.tags && formik.errors.tags)}
							fullWidth
							helperText={formik.touched.tags && formik.errors.tags}
							label="Tags"
							name="tags"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="text"
							value={formik.values.tags}
							sx={{
								marginBottom: '16px'
							}}
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
							await authenticatedDeleteRequest(`/jobs/templates/${template._id}`)
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

TemplateDetails.propTypes = {
	template: PropTypes.object,
}