import React, { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Spinner } from '../components/common/Spinner';
import { useTranslation } from 'react-i18next';

const ReportPage = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [reports, setReports] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      setPageLoading(true);
      setError(null);
      if (!authLoading && isAuthenticated && user?.uid) {
        try {
          const userReports = await getReports(user.uid);
          setReports(userReports);
        } catch (err) {
          setError(t('common.error') + ": " + err.message);
          console.error(err);
        } finally {
          setPageLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
        setError(t('report.login_required'));
        setPageLoading(false);
      }
    };

    fetchUserReports();
  }, [authLoading, isAuthenticated, user, t]);

  const handleDelete = async (reportId) => {
    if (window.confirm(t('report.delete_confirm'))) {
      try {
        await deleteReport(reportId);
        setReports(prevReports => prevReports.filter(report => report.id !== reportId));
        alert(t('report.delete_success'));
      } catch (err) {
        alert(t('report.delete_error'));
        console.error(err);
      }
    }
  };

  if (authLoading || pageLoading) {
    return <Spinner message={authLoading ? t('common.loading') : t('common.loading')} />;
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">{error}</p>
        <Link to="/auth" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          {t('report.login_button')}
        </Link>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <p className="text-xl mb-4">{t('report.empty')}</p>
        <Link to="/scan" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          {t('report.start_scan')}
        </Link>
      </div>
    );
  }

  if (!isAuthenticated || error === t('report.login_required')) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">{t('report.login_required')}</p>
        <Link to="/auth" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300">
          {t('report.login_button')}
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-500">
        <p className="text-xl mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {t('report.try_again')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('report.title')}</h1>
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
                {report.predictionClass ? `${t('report.prediction')}: ${report.predictionClass.replace(/_/g, ' ')}` : 'No Prediction'}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                {t('report.date')}: {report.timestamp ? format(report.timestamp.toDate(), 'dd MMMM yyyy HH:mm') : 'N/A'}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/report/${report.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('report.view_details')}
                </Link>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md border border-red-600 hover:bg-red-50"
                >
                  {t('report.delete')}
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