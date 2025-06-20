import React, { useState,useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom'; // ✅ import this

const ResumeAnalyzer = () => {
    const navigate = useNavigate(); // ✅ hook for navigation

  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription || !file) {
      alert("Please provide both job description and resume file.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('file', file);

    try {
const res = await fetchWithAuth('http://localhost:3000/api/analyze', 'POST', formData);
      setResult(res.data);
    } catch (err) {
      alert("Something went wrong. Try again!");
      console.error(err);
    } finally {
      setLoading(false);
      setFile(null)
      setJobDescription('')
    }
  };

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:3000/api/ping');
      console.log('🔓 User authenticated:', res.data);
    } catch (err) {
      console.error('❌ User not authenticated:', err);
      // Optional: Redirect or show login modal
    }
  };

  checkAuth();
}, []);


  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Resume Analyzer</h1>

         {/* 🔙 Go Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/land')}
          className="text-indigo-600 font-medium hover:underline"
        >
          ← Back to Home
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Job Description</label>
          <textarea
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Analyze Resume
        </button>
      </form>

      {loading && (
        <div className="mt-6 text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-indigo-500 h-10 w-10 mx-auto animate-spin"></div>
          <p className="text-gray-600 mt-2">Analyzing...</p>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4 bg-gray-50 p-6 rounded-lg border">
          <p><strong className="text-indigo-600">Score:</strong> {result.analysis.split('\n')[0]}</p>
          <p><strong className="text-green-600">Good:</strong> {result.analysis.split('\n')[2]}</p>
          <p><strong className="text-red-600">Missing:</strong> {result.analysis.split('\n')[4]}</p>
          <p><strong className="text-yellow-600">Suggestions:</strong> {result.analysis.split('\n')[6]}</p>

          <div>
            <h3 className="font-semibold text-gray-800 mt-4">Missing Skills</h3>
            {result.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {result.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : <p className="italic text-gray-500">No missing skills</p>}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mt-4">Matched Skills</h3>
            {result.matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {result.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : <p className="italic text-gray-500">No matched skills</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
