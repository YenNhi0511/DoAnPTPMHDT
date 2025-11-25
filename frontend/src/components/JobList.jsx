import React, { useEffect, useState } from 'react';
import { getJobs } from '../services/api';
import ApplyForm from './ApplyForm';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getJobs()
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch jobs');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Open Jobs</h2>
      <div className="grid grid-cols-1 gap-4">
        {jobs.length === 0 && <div>No jobs found</div>}
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.location} — {job.employment_type}</p>
            <p className="text-sm mt-2">{job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? '...' : ''}</p>
            <div className="mt-3">
              <ApplyForm jobId={job.id} onSuccess={() => alert('Application submitted')} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
