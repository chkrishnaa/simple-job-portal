import jobsCSV from './jobs.csv?raw';
import { parseCSV } from '../utils/csvParser';

export type { Job } from '../utils/csvParser';
export const availableJobs = parseCSV(jobsCSV);