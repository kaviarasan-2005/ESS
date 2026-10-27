// useRangeSupportEditor.js — Data logic hook for EcoPhysicsRangeSupportAdminEditor
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../../components/ToastContext';
import {
  fetchEcoPhysicsRangeSupport,
  updateEcoPhysicsRangeSupport,
} from '../../../services/ecoPhysicsService';
import { uploadImageFile } from '../../../services/uploadService';

const DEFAULT_FORM = {
  product_range_title: 'Our Eco Physics Product Range',
  product_range_subtitle:
    'ECO Physics offers a specialized portfolio of analyzers, with each series engineered to excel in specific environments and applications. Whether your priority is rugged reliability for continuous industrial monitoring or ultra-high sensitivity for research, we provide the precise tool to meet your measurement challenges and data quality objectives.',
  card_1_title: 'CEMS & Industrial Emissions Monitoring Analyzers',
  card_1_desc:
    'Ensure 100% compliance with regional environmental regulations. Our robust NOx analyzers for CEMS are designed for continuous, unattended operation in harsh industrial environments.',
  card_2_title: 'Ambient Air & Research-Grade NOx Analyzers',
  card_2_desc:
    "To protect public health and advance scientific understanding, ECO Physics' sensitive ambient air quality analyzers come in extremely handy.",
  support_title: 'Technical Expertise & Support',
  support_para_1:
    'We provide complete solutions, not just instruments. Our technical team offers expert application consulting to select the perfect analyzer for your specific needs.',
  support_para_2:
    'To protect your investment, we provide ISO 17025 accredited calibration services and comprehensive maintenance contracts.',
  industries_title: 'Industries We Serve',
  industries_intro: 'ECO Physics solutions find usage in the following major applications:',
  industry_list: [
    {
      label: 'Continuous Emission Monitoring (CEMS)',
      detail: 'For stack emissions compliance in power and industrial plants.',
    },
    {
      label: 'Engine & Turbine Testing',
      detail:
        'For development and emissions certification in the automotive and aerospace sectors.',
    },
  ],
  industry_image_url: '',
  industry_image_caption: 'Eco Physics Analyzers used in Oil & Gas Industries',
  footer_text:
    'ECO Physics product applications across Doha and other places in the Middle East has been soaring of late. To know more about our offerings, send an email to our ECO Physics product experts and we will reach out to you right away.',
  contact_email: 'info@ess-me.com',
  link_text: 'send an email to our ECO Physics product experts',
};

const validateImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width < 500 || img.height < 250) {
        reject(
          `Image is too small (${img.width}x${img.height}px). Minimum required dimensions are 500x250px.`
        );
      } else {
        resolve(true);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject('Invalid image file.');
    };
    img.src = objectUrl;
  });

const useRangeSupportEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  // ── Load data from DB ──────────────────────────────────────────────────────
  const loadSectionData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchEcoPhysicsRangeSupport();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        // Use setTimeout(0) to yield the main thread before heavy state update,
        // reducing the 'message handler took Xms' violation.
        setTimeout(() => setFormData((prev) => ({ ...prev, ...content })), 0);
      }
    } catch (err) {
      console.error('Failed to load range and support section data:', err);
      showToast('Failed to load range and support section data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadSectionData();
  }, [loadSectionData]);

  // ── Field change handlers ──────────────────────────────────────────────────
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleIndustryListChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedList = [...prev.industry_list];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, industry_list: updatedList };
    });
  }, []);

  const addIndustryItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      industry_list: [...prev.industry_list, { label: '', detail: '' }],
    }));
  }, []);

  const removeIndustryItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      industry_list: prev.industry_list.filter((_, i) => i !== index),
    }));
  }, []);

  // ── Image handlers ─────────────────────────────────────────────────────────
  const handleFileUpload = useCallback(
    async (file) => {
      if (!file) return;
      setUploadingImg(true);
      try {
        const uploadRes = await uploadImageFile(file);
        const uploadedUrl = uploadRes?.url || uploadRes?.file_path || uploadRes?.data?.url || uploadRes;
        if (uploadedUrl && typeof uploadedUrl === 'string') {
          setFormData((prev) => ({ ...prev, industry_image_url: uploadedUrl }));
          showToast('Industry image uploaded successfully!', 'success');
        } else {
          showToast('Failed to process uploaded image URL.', 'error');
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        showToast(typeof err === 'string' ? err : 'Failed to upload image file.', 'error');
      } finally {
        setUploadingImg(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [showToast]
  );

  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, industry_image_url: '' }));
    showToast('Industry image removed.', 'info');
  }, [showToast]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        const res = await updateEcoPhysicsRangeSupport(formData);
        const updatedContent = res?.data?.data || res?.data || formData;
        setFormData((prev) => ({ ...prev, ...updatedContent }));
        showToast('Range & Support section published successfully!', 'success');
      } catch (err) {
        console.error('Failed to update range support section:', err);
        showToast(err.response?.data?.detail || 'Failed to save changes to server.', 'error');
      } finally {
        setSaving(false);
      }
    },
    [formData, showToast]
  );

  return {
    formData,
    loading,
    saving,
    uploadingImg,
    fileInputRef,
    handleInputChange,
    handleIndustryListChange,
    addIndustryItem,
    removeIndustryItem,
    handleFileUpload,
    handleRemoveImage,
    handleSubmit,
  };
};

export default useRangeSupportEditor;
