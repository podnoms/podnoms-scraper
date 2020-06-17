import mongoose from 'mongoose';
import { UserDocument } from './User';
export type PageRequestDocument = mongoose.Document & {
    sourceIp: string;
    urlRequested: string;
    dateRequested: Date;
    result: string;
    payload: string;
};
const pageRequestSchema = new mongoose.Schema({
    sourceIp: { type: String, },
    urlRequested: { type: String, },
    dateRequested: { type: Date, },
    result: { type: String, },
    payload: { type: [], },
});
export const PageRequest = mongoose.model<PageRequestDocument>(
    'PageRequest',
    pageRequestSchema
);
