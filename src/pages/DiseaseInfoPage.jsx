import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { getDiseases, deleteDisease, saveDisease } from '../services/diseaseService';
import { Spinner } from '../components/common/Spinner';
import AddEditDiseaseForm from '../components/common/AddEditDiseaseForm';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const DiseaseInfoPage = () => {
    const { t } = useTranslation();
    const { isAdmin } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingDisease, setEditingDisease] = useState(null);

    const fetchDiseases = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDiseases();
            console.log("DiseaseInfoPage: Data diterima:", data);
            setDiseases(data);
        } catch (err) {
            console.error("Error fetching diseases:", err);
            setError(t('disease.error_loading'));
            toast.error(t('disease.error_loading'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchDiseases();
    }, [fetchDiseases]);

    const handleOpenAddModal = () => {
        setEditingDisease(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (disease) => {
        setEditingDisease(disease);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDisease(null);
    };

    const handleFormSubmit = async (diseaseId, diseaseData) => {
        const isEditing = Boolean(editingDisease);
        const loadingToastId = toast.loading(t('disease.saving'));
        try {
            await saveDisease(diseaseId, diseaseData);
            toast.success(t('disease.save_success'), { id: loadingToastId });
            handleCloseModal();
            fetchDiseases();
        } catch (err) {
            console.error(`Error saving disease:`, err);
            toast.error(t('disease.save_error'), { id: loadingToastId });
        }
    };

    const handleDeleteDisease = async (diseaseId, diseaseName) => {
        if (window.confirm(t('disease.delete_confirm', { name: diseaseName || diseaseId }))) {
            const loadingToastId = toast.loading(t('disease.saving'));
            try {
                await deleteDisease(diseaseId);
                toast.success(t('disease.delete_success'), { id: loadingToastId });
                fetchDiseases();
            } catch (err) {
                console.error("Error deleting disease:", err);
                toast.error(t('disease.delete_error'), { id: loadingToastId });
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-charcoal">{t('disease.title')}</h1>
                {isAdmin && (
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-sage text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-all"
                    >
                        <PlusCircle size={20} /> {t('disease.add')}
                    </button>
                )}
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={handleCloseModal}
                ></div>
            )}

            {isModalOpen && (
                <AddEditDiseaseForm
                    initialData={editingDisease}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                />
            )}

            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Spinner />
                        <p className="ml-2">{t('disease.loading')}</p>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : diseases.length > 0 ? (
                    <ul className="space-y-4">
                        {diseases.map((disease) => (
                            <li key={disease.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-md transition-shadow">
                                <Link
                                    to={`/disease/${disease.id}`}
                                    className="flex-grow text-lg font-semibold text-charcoal hover:text-sage mr-4"
                                >
                                    {disease.nama || disease.id.replace(/_/g, ' ')}
                                </Link>
                                {isAdmin && (
                                    <div className="flex-shrink-0 flex gap-2">
                                        <button
                                            onClick={() => handleOpenEditModal(disease)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title={t('disease.edit')}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDisease(disease.id, disease.nama)}
                                            className="text-red-600 hover:text-red-800"
                                            title={t('disease.delete')}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">{t('disease.empty')}</p>
                )}
            </div>
        </div>
    );
};

export default DiseaseInfoPage;