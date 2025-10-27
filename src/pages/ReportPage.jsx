// src/pages/ReportPage.jsx
import React, { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext'; 
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
// Asumsi Anda memiliki komponen Spinner
import { Spinner } from '../components/common/Spinner'; // Sesuaikan path ini jika beda

const ReportPage = () => {
  // Dapatkan currentUser dan loading status dari AuthContext
  const { currentUser, loading: authLoading, isAuthenticated } = useAuth(); 
  
  const [reports, setReports] = useState([]);
  const [pageLoading, setPageLoading] = useState(true); // Loading untuk data laporan
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      setPageLoading(true); // Mulai loading untuk data laporan
      setError(null);     // Reset error

      // KUNCI: Tunggu sampai authLoading selesai DAN user terautentikasi
      // Jika authLoading masih true, atau user tidak terautentikasi, 
      // jangan lakukan fetch. Render kondisional di bawah akan menanganinya.
      if (!authLoading && isAuthenticated && currentUser?.uid) { // Periksa currentUser?.uid di sini
        try {
          // Sekarang, kita yakin currentUser.uid tersedia
          const userReports = await getReports(currentUser.uid); 
          setReports(userReports);
        } catch (err) {
          setError("Failed to fetch reports. " + err.message); 
          console.error(err);
        } finally {
          setPageLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
          // Jika authLoading selesai tapi tidak terautentikasi, set error.
          // Ini penting karena ProtectedRoute mungkin merender ReportPage sebelum redirect.
          setError("You need to be logged in to view your reports.");
          setPageLoading(false);
      }
      // Jika authLoading masih true, kita tidak melakukan apa-apa,
      // karena kita akan menampilkan spinner di render kondisional di bawah.
    };

    fetchUserReports();
  }, [authLoading, isAuthenticated, currentUser]); // Dependensi utama

  const handleDelete = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(reportId);
        setReports(prevReports => prevReports.filter(report => report.id !== reportId));
        alert("Report deleted successfully!");
      } catch (err) {
        alert("Failed to delete report.");
        console.error(err);
      }
    }
  };

  // --- Render Kondisional Awal ---
  // Tampilkan spinner jika AuthContext masih loading status autentikasi
  if (authLoading || pageLoading) {
    return <Spinner message={authLoading ? "Checking authentication..." : "Loading reports..."} />;
  }

  // 2. Tampilkan error jika ada
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">{error}</p>
        <Link to="/auth" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          Login / Register
        </Link>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <p className="text-xl mb-4">You don't have any reports yet.</p>
        <Link to="/scan" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          Start a new scan
        </Link>
      </div>
    );
  }

  // Jika authLoading selesai, tapi tidak terautentikasi (error sudah di-set di useEffect)
  if (!isAuthenticated || error === "You need to be logged in to view your reports.") {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">You need to be logged in to view your reports.</p>
        <Link to="/auth" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300">
          Login / Register
        </Link>
      </div>
    );
  }

  // Tampilkan error umum jika ada error setelah loading selesai
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <p className="text-xl mb-4">You don't have any reports yet.</p>
        <Link to="/scan" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300">
          Start a new scan
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Scan Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img 
              src={report.imageURL || 'placeholder-image.jpg'} 
              alt="Scan Result" 
              className="w-full h-48 object-cover" 
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {report.prediction ? `Prediction: ${report.prediction}` : 'No Prediction'}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Date: {report.timestamp ? format(report.timestamp.toDate(), 'dd MMMM yyyy HH:mm') : 'N/A'}
              </p>
              <div className="flex justify-between items-center">
                <Link 
                  to={`/report/${report.id}`} 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleDelete(report.id)} 
                  className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md border border-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage;