import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const ReportDetailPage = () => {
  const { reportId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }
      try {
        const fetchedReport = await getReportById(reportId);
        if (fetchedReport && fetchedReport.userId === user.uid) { 
          setReport(fetchedReport);
        } else {
          setError("Report not found or you don't have permission to view it.");
          navigate('/reports'); 
        }
      } catch (err) {
        setError("Failed to fetch report details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-700">
        Loading report details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">{error}</p>
        <button 
          onClick={() => navigate('/reports')} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <p className="text-xl mb-4">Report not found.</p>
        <button 
          onClick={() => navigate('/reports')} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg max-w-2xl mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report Details</h1>
      
      <div className="mb-6 flex justify-center">
        <img 
          src={report.imageURL || 'placeholder-image.jpg'} 
          alt="Scanned Object" 
          className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Prediction:</h2>
          <p className="text-gray-900 text-lg">{report.diseaseDetails.nama || 'N/A'}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Timestamp:</h2>
          <p className="text-gray-900 text-lg">
            {report.timestamp ? format(report.timestamp.toDate(), 'dd MMMM yyyy HH:mm:ss') : 'N/A'}
          </p>
        </div>
        {report.confidence && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Confidence:</h2>
            <p className="text-gray-900 text-lg">{(report.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
        {report.notes && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Notes:</h2>
            <p className="text-gray-900 text-lg">{report.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/reports')} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Back to All Reports
        </button>
      </div>
    </div>
  );
};

export default ReportDetailPage;