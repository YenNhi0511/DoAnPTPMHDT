import React from 'react';
import JobList from './components/JobList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Recruitment Frontend</h1>
        <JobList />
      </div>
    </div>
  );
}

export default App;
