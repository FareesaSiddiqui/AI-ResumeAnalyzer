import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, BadgeCheck, Rocket } from "lucide-react";
import AuthModal from "./AuthModal";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const API_URL = "https://ai-resumeanalyzer-backend.onrender.com"

const LandingPage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleAccessCheck = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    navigate("/");
  } else {
    setShowModal(true);
  }
};


  // const handleProtectedAnalyze = async (formData) => {
  //   try {
  //     const res = await fetchWithAuth("http://localhost:3000/api/analyze", "POST", formData);
  //     console.log("✅ Analyze result:", res.data);
  //     alert("Analysis complete! Check console for details.");
  //   } catch (err) {
  //     alert("Something went wrong. Try again!");
  //     console.error(err);
  //   }
  // };

const handleLogout = async () => {
  try {
    await axios.post(`${API_URL}/api/auth/logout`, {}, {
      withCredentials: true, // important for sending the refresh cookie
    });

    localStorage.removeItem("accessToken"); // remove access token
    setIsLoggedIn(false);                   // update UI state
    navigate("/land");                      // redirect to landing page
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Error logging out. Please try again.");
  }
};

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Resume Analyzer</h1>
        {!isLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-indigo-700 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Logout
          </button>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-5xl font-extrabold leading-tight mb-6 animate-fade-in">
          Supercharge Your Resume
        </h2>
        <p className="text-xl max-w-2xl mb-8 opacity-90 animate-fade-in delay-200">
          Upload your resume, paste the job description, and let our AI analyze
          how well your resume fits the job — get improvement tips instantly.
        </p>
        <button
          // onClick={() => setShowModal(true)}
          onClick={handleAccessCheck}
          className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-medium shadow-xl hover:bg-indigo-100 transition animate-bounce"
        >
          Try it Now
        </button>

        {/* Form shown only if logged in */}
      
      </main>

      {/* Divider */}
      <div className="relative h-24 -mb-24">
        <div className="absolute top-0 left-0 right-0 h-32 bg-white transform -skew-y-3 origin-top"></div>
      </div>

      {/* Features Section */}
      <section className="bg-white text-gray-800 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            How It <span className="text-indigo-600">Works</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-10 mb-20">
            <div className="flex-1 bg-indigo-50 rounded-2xl p-8 border-l-4 border-indigo-500">
              <div className="text-indigo-600 text-4xl mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">Upload & Analyze</h3>
              <p>Submit your resume and the job description you're targeting</p>
            </div>

            <div className="flex-1 bg-indigo-50 rounded-2xl p-8 border-l-4 border-indigo-500 transform md:translate-y-10">
              <div className="text-indigo-600 text-4xl mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">AI Matching</h3>
              <p>
                Our Gemini AI scans for skills, keywords, and qualifications
              </p>
            </div>

            <div className="flex-1 bg-indigo-50 rounded-2xl p-8 border-l-4 border-indigo-500">
              <div className="text-indigo-600 text-4xl mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">Get Insights</h3>
              <p>
                Receive actionable feedback to improve your resume instantly
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-3">Real-Time Analysis</h3>
              <Sparkles className="h-10 w-10 text-indigo-600" />
              <p>
                Powered by Gemini AI to give you smart, on-point feedback
                instantly.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-100 shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">Skill Matching</h3>
              <p>
                See which job skills you have and which ones you're missing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-3">Simple to Use</h3>
              <p>
                Paste the job description, upload your resume, and get results — all in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get ahead of other applicants with a resume optimized for the exact
            position you want
          </p>
<button
  onClick={handleAccessCheck}
  className="bg-white text-indigo-700 px-8 py-4 rounded-full text-lg font-medium shadow-xl hover:bg-indigo-100 transition inline-block"
>
  Analyze My Resume Now
</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm bg-indigo-700 text-white">
        Made with 💡 by Fareesa • AI Resume Analyzer 2025
      </footer>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default LandingPage;
