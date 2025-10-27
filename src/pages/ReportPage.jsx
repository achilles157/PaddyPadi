// src/pages/ReportPage.jsx
import React, { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext'; 
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ReportPage = () => {
  const { currentUser, loading: authLoading, isAuthenticated } = useAuth(); // Ambil loading dan isAuthenticated dari context
  const [reports, setReports] = useState([]);
  const [pageLoading, setPageLoading] = useState(true); // Loading untuk data laporan
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchReports = async () => {
      // Selalu set pageLoading jadi true di awal fetch, untuk menampilkan loading state
      setPageLoading(true); 
      setError(null); // Reset error setiap kali fetch baru

      // 1. Jika Auth masih loading, jangan lakukan apa-apa dulu.
      if (authLoading) {
        return; 
      }

      // 2. Jika Auth sudah selesai loading, tapi user tidak terautentikasi
      if (!isAuthenticated) {
        setError("User not authenticated. Please log in to view reports.");
        setPageLoading(false);
        return;
      }
      
      // 3. Jika Auth sudah selesai loading DAN user terautentikasi,
      //    pastikan currentUser memiliki UID sebelum mencoba menggunakannya.
      //    Ini adalah perlindungan ekstra jika currentUser entah bagaimana masih null/undefined
      //    meskipun isAuthenticated adalah true. (Skenario yang sangat jarang, tapi untuk safety)
      if (currentUser && currentUser.uid) { // <-- PENTING: Tambahkan currentUser && currentUser.uid
        try {
          const userReports = await getReports(currentUser.uid); 
          setReports(userReports);
        } catch (err) {
          setError("Failed to fetch reports. " + err.message); // Tampilkan pesan error yang lebih spesifik
          console.error(err);
        } finally {
          setPageLoading(false);
        }
      } else {
        // Ini seharusnya tidak terjadi jika isAuthenticated sudah true,
        // tapi sebagai fallback jika ada masalah di AuthContext
        setError("User authentication data is incomplete.");
        setPageLoading(false);
      }
    };

    fetchReports();
    // Dependensi: effect akan dijalankan ulang jika authLoading, isAuthenticated, atau currentUser.uid berubah.
    // currentUser.uid spesifik ditambahkan karena ini yang diakses.
  }, [authLoading, isAuthenticated, currentUser?.uid]);

  const handleDelete = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(reportId);
        setReports(reports.filter(report => report.id !== reportId));
        alert("Report deleted successfully!");
      } catch (err) {
        alert("Failed to delete report.");
        console.error(err);
      }
    }
  };

  // Tampilkan loading jika autentikasi masih loading ATAU data laporan masih loading
  if (authLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-700">
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error: {error}
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