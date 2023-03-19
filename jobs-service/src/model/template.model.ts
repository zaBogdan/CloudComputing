import mongoose from 'mongoose';
const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parameters: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    substitute: [{
        variable: {
            type: String,
            required: true,
        },
        value: {
            type: String || Number || Boolean,
            required: true,
        }
    }]
});
export default mongoose.model('template', templateSchema);
