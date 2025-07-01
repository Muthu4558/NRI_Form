import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import india from '../assets/indiaData.json';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');

    const countryCodes = [
        { code: '+91', label: 'India' },
        { code: '+1', label: 'USA' },
        { code: '+971', label: 'UAE' },
        { code: '+44', label: 'UK' },
        { code: '+61', label: 'Australia' },
        { code: '+49', label: 'Germany' },
        { code: '+33', label: 'France' },
        { code: '+65', label: 'Singapore' },
        { code: '+60', label: 'Malaysia' },
        { code: '+94', label: 'Sri Lanka' },
        { code: '+973', label: 'Bahrain' },
        { code: '+974', label: 'Qatar' },
        { code: '+968', label: 'Oman' },
        { code: '+966', label: 'Saudi' },
        { code: '+41', label: 'Switzerland' },
    ];

    const healthOptions = [
        "Cardiovascular Diseases(CVDs)",
        "Diabetes",
        "Cancers",
        "Respiratory Diseases",
        "Tuberculosis(TB)",
        "Vector - Borne Diseases(Dengue, Malaria, Chikungunya)",
        "Gastrointestinal Infections",
        "Hepatitis(A, B, C)",
        "Obesity & Poor Nutrition",
        "Mental Health Disorders",
        "Anemia",
        "Vision issues",
        "Hearing issues",
        "Joint & Bone Disorders",
    ];

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '+91',
        lovedOnes: [{
            name: '', age: '', gender: '', state: '', district: '', area: '', contact: '+91', healthConcerns: []
        }],
    });

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const handleCountryChange = (e) => {
        const code = e.target.value;
        setSelectedCountryCode(code);
        setFormData(prev => ({ ...prev, mobile: code }));
    };

    const handleMobileInputChange = (e) => {
        let input = e.target.value;
        if (!input.startsWith(selectedCountryCode)) {
            input = selectedCountryCode;
        }
        const numberAfterCode = input.slice(selectedCountryCode.length).replace(/[^\d]/g, '').slice(0, 10);
        const finalNumber = selectedCountryCode + numberAfterCode;
        setFormData(prev => ({ ...prev, mobile: finalNumber }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/form/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setIsSubmitted(true);
            } else {
                alert('Submission failed');
                console.error(data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLovedOneChange = (index, field, value) => {
        const updated = [...formData.lovedOnes];
        if (field === 'name') value = value.replace(/[^A-Za-z\s]/g, '');
        if (field === 'state') updated[index]['district'] = '';
        updated[index][field] = value;
        setFormData({ ...formData, lovedOnes: updated });
    };

    const handleHealthConcernChange = (index, concern) => {
        const updated = [...formData.lovedOnes];
        const concerns = updated[index].healthConcerns || [];
        if (concerns.includes(concern)) {
            updated[index].healthConcerns = concerns.filter(c => c !== concern);
        } else {
            updated[index].healthConcerns = [...concerns, concern];
        }
        setFormData({ ...formData, lovedOnes: updated });
    };

    const handleAddLovedOne = () => {
        setFormData(prev => ({
            ...prev,
            lovedOnes: [...prev.lovedOnes, {
                name: '', age: '', gender: '', state: '', district: '', area: '', contact: '+91', healthConcerns: []
            }]
        }));
    };

    const confirmDeleteLovedOne = (index) => {
        setConfirmDeleteIndex(index);
    };

    const handleConfirmDelete = () => {
        const updated = [...formData.lovedOnes];
        updated.splice(confirmDeleteIndex, 1);
        setFormData({ ...formData, lovedOnes: updated });
        setConfirmDeleteIndex(null);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteIndex(null);
    };

    const ThankYouMessage = () => (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-teal-200 to-green-100 px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Thank you!</h1>
            <p className="text-lg">Our expert will call you shortly from</p>
            <p className="text-2xl font-semibold mt-2">📞 8148809313</p>
            <p className="text-sm mt-2">between 10 AM and 8 PM. Please save the number.</p>
        </div>
    );

    if (isSubmitted) return <ThankYouMessage />;

    return (
         <div className="relative min-h-screen bg-gradient-to-br from-teal-200 to-green-100 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-teal-500 mb-6 md:mb-10 tracking-wider font-serif">
          NRI Enquiry Portal
        </h1>

        <form className="space-y-10 md:space-y-12" onSubmit={handleSubmit}>
          {/* Contact Info */}
          <section className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-4">
              <h2 className="text-xl md:text-2xl font-bold text-teal-500">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <label className="fancy-label">First Name<span className="text-red-500">*</span>
                <input type="text" className="fancy-input" placeholder='First Name' value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
              </label>
              <label className="fancy-label">Last Name<span className="text-red-500">*</span>
                <input type="text" className="fancy-input" placeholder='Last Name' value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
              </label>
              <label className="fancy-label">Email<span className="text-red-500">*</span>
                <input type="email" className="fancy-input" placeholder='Email' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </label>
              <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-3 gap-2 items-center">
                <select value={selectedCountryCode} onChange={handleCountryChange} className="fancy-input">
                  {countryCodes.map((c) => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
                </select>
                <input type="tel" placeholder="Mobile Number" className="fancy-input col-span-2" value={formData.mobile} onChange={handleMobileInputChange} onKeyDown={(e) => {
                  if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart <= selectedCountryCode.length) {
                    e.preventDefault();
                  }
                }} required />
              </div>
            </div>
          </section>

          {/* Loved Ones */}
          <section className="space-y-6">
            <div className="border-l-4 border-teal-500 pl-4">
              <h2 className="text-xl md:text-2xl font-bold text-teal-500">Loved Ones Details</h2>
            </div>
            {formData.lovedOnes.map((p, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-teal-100/40 p-4 rounded-xl">
                <input type="text" placeholder="Name *" className="fancy-input" value={p.name} onChange={e => handleLovedOneChange(i, 'name', e.target.value)} required />
                <input type="number" placeholder="Age *" className="fancy-input" value={p.age} onChange={e => handleLovedOneChange(i, 'age', e.target.value)} required />
                <select className="fancy-input" value={p.gender} onChange={e => handleLovedOneChange(i, 'gender', e.target.value)} required>
                  <option value="">Gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input type="text" placeholder="Contact No *" className="fancy-input" value={p.contact} onChange={e => {
                  let input = e.target.value;
                  if (!input.startsWith('+91')) input = '+91' + input.replace(/[^\d]/g, '').slice(0, 10);
                  else input = '+91' + input.slice(3).replace(/[^\d]/g, '').slice(0, 10);
                  handleLovedOneChange(i, 'contact', input);
                }} onKeyDown={e => (e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart <= 3 && e.preventDefault()} required />
                <select className="fancy-input" value={p.state} onChange={e => handleLovedOneChange(i, 'state', e.target.value)} required>
                  <option value="">State *</option>
                  {Object.keys(india).map(state => <option key={state}>{state}</option>)}
                </select>
                <select className="fancy-input" value={p.district} onChange={e => handleLovedOneChange(i, 'district', e.target.value)} required>
                  <option value="">District *</option>
                  {p.state && india[p.state]?.map(d => <option key={d}>{d}</option>)}
                </select>
                <input type="text" placeholder="Pincode *" className="fancy-input md:col-span-2" value={p.area} maxLength={6} onChange={e => handleLovedOneChange(i, 'area', e.target.value.replace(/\D/g, '').slice(0, 6))} required />
                <div className="md:col-span-4">
                  <label className="block font-semibold text-teal-600 mb-1">Health Concerns</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {healthOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" checked={p.healthConcerns.includes(opt)} onChange={() => handleHealthConcernChange(i, opt)} /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
                {formData.lovedOnes.length > 1 && (
                  <button type="button" onClick={() => confirmDeleteLovedOne(i)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddLovedOne} className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-400 shadow-md transition-all">
              + Add Member
            </button>
          </section>

          <div className="text-center">
            <button type="submit" disabled={loading} className={`bg-teal-500 hover:bg-teal-400 text-white text-lg px-8 py-3 rounded-full shadow-xl transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : "Submit Enquiry"}
            </button>
          </div>
        </form>
      </div>

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl text-center max-w-xs w-full">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete?</h2>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirmDelete} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              <button onClick={handleCancelDelete} className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default Home;