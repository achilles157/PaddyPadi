import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Spinner } from '../components/common/Spinner';
import { getDiseaseById } from '../services/diseaseService';
import { useAuth } from '../contexts/AuthContext';
import { addReport } from '../services/reportService';
import { serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const ResultPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { prediction, imageSrc } = location.state || {};

  const [diseaseData, setDiseaseData] = useState(null);
  const [loadingDisease, setLoadingDisease] = useState(true);

  const [savingReport, setSavingReport] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (prediction && prediction.class_name) {
      if (prediction.class_name === 'normal') {
        setDiseaseData({
          nama: 'Padi Sehat (Normal)',
          penjelasan: 'Tanaman padi Anda dalam kondisi sehat.',
          penanggulangan_cepat: ['Tidak diperlukan penanganan khusus, lanjutkan perawatan rutin seperti pemupukan dan pengairan yang baik.'] // Sesuaikan format
        });
        setLoadingDisease(false);
      } else {
        const fetchDiseaseData = async () => {
          setLoadingDisease(true);
          try {
            const data = await getDiseaseById(prediction.class_name);
            if (data) {
              setDiseaseData(data);
            } else {
              console.error('No disease data found for label:', prediction.class_name);
              setDiseaseData(null);
            }
          } catch (error) {
            console.error('Error fetching disease data:', error);
          } finally {
            setLoadingDisease(false);
          }
        };
        fetchDiseaseData();
      }
    } else {
      setLoadingDisease(false);
    }
  }, [prediction]);

  const handleSaveReport = async () => {
    if (!user) {
      setSaveError(t('result.login_required'));
      alert(t('result.login_required'));
      return;
    }
    if (!prediction || !imageSrc) {
      setSaveError(t('result.no_data'));
      alert(t('result.no_data'));
      return;
    }

    setSavingReport(true);
    setSaveError(null);

    try {
      const reportData = {
        userId: user.uid,
        predictionClass: prediction.class_name,
        confidence: prediction.confidence,
        modelUsed: prediction.model,
        imageUrl: imageSrc,
        diseaseId: prediction.class_name,
        diseaseDetails: diseaseData ? {
          nama: diseaseData.nama,
          penjelasan: diseaseData.penjelasan,
          penyebab: diseaseData.penyebab,
          penanggulangan_cepat: diseaseData.penanggulangan_cepat,
        } : null,
        timestamp: serverTimestamp(),
      };

      await addReport(reportData);
      alert(t('result.save_success'));
      navigate('/reports');
    } catch (err) {
      setSaveError(t('result.error_save') + ' ' + err.message);
      console.error('Error saving report:', err);
      alert(t('result.error_save'));
    } finally {
      setSavingReport(false);
    }
  };
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <Spinner />
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!prediction || !imageSrc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">{t('common.error')}</h1>
        <p className="text-gray-700">{t('result.no_data')}</p>
        <button
          onClick={() => navigate('/scan')}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          {t('result.back_to_scan')}
        </button>
      </div>
    );
  }

  const getConfidenceColor = (conf) => {
    if (conf > 0.85) return 'border-green-500';
    if (conf > 0.6) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={imageSrc}
          alt={t('result.scan_result')}
          className={`w-full h-64 object-cover border-b-8 ${getConfidenceColor(prediction.confidence)}`}
        />
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {prediction && prediction.class_name ? prediction.class_name.replace(/_/g, ' ') : t('common.loading')}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {t('result.confidence')}: <span className="font-bold">
              {prediction && typeof prediction.confidence === 'number'
                ? `${(prediction.confidence * 100).toFixed(2)}%`
                : 'N/A'}
            </span>
          </p>

          <span className="text-xs text-gray-400 italic">
            {t('result.model')}: {prediction.model}
          </span>

          {loadingDisease ? (
            <div className="my-4">
              <Spinner />
              <p className="text-gray-500">{t('result.loading_details')}</p>
            </div>
          ) : diseaseData ? (
            <div className="mt-6 pt-4 border-t border-gray-200 text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{diseaseData.nama}</h2>

              {diseaseData.penjelasan && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{t('result.description')}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{diseaseData.penjelasan}</p>
                </div>
              )}

              {diseaseData.penyebab && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{t('result.causes')}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{diseaseData.penyebab}</p>
                </div>
              )}

              {diseaseData.penanggulangan_cepat && Array.isArray(diseaseData.penanggulangan_cepat) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{t('result.treatment')}</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {diseaseData.penanggulangan_cepat.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            prediction.class_name !== 'normal' && (
              <p className="mt-6 text-red-500">{t('result.no_details')}</p>
            )
          )}
          {saveError && <p className="text-red-500 text-sm mt-4">{saveError}</p>}
          <button
            onClick={handleSaveReport}
            disabled={savingReport || loadingDisease}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 disabled:opacity-50"
          >
            {savingReport ? <Spinner size="sm" /> : t('result.save_report')}
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-full transition duration-300"
          >
            {t('result.scan_again')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;