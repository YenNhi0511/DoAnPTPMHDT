import React, { useState } from 'react';
import api from '../services/api';

export default function ApplyForm({ jobId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('cv_file', file);
      form.append('cover_letter', cover);
      if (email) form.append('candidate_email', email);
      if (name) form.append('candidate_name', name);

      const res = await api.post(`/jobs/${jobId}/apply/`, form, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      setMessage('Application submitted');
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="" />
      <input type="text" placeholder="Full name (if not logged in)" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email (if not logged in)" value={email} onChange={e => setEmail(e.target.value)} />
      <textarea placeholder="Cover letter" value={cover} onChange={e => setCover(e.target.value)} />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? 'Submitting...' : 'Apply'}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
