import mongoose from 'mongoose';

const jobMetadataSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		required: true
	},
	updatedAt: {
		type: Date,
		required: true
	},
	origin: {
		type: Number,
		enum: [0, 1, 2],
		required: true
	}
}, {
	_id: false
});

const jobSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	runnerId: {
		type: String,
		required: true
	},
	tags: [String],
	metadata: {
		type: jobMetadataSchema,
		required: true
	},
	triggeredBy: {
		type: String,
		required: true
	},
	parameters: {
		type: Object,
		required: true
	}
});

export default mongoose.model('Job', jobSchema);