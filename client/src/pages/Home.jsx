import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';
import { FaUser, FaHeartbeat, FaUsers, FaTrashAlt } from 'react-icons/fa';
import india from '../assets/indiaData.json';

const Home = () => {
    const phoneInputRef = useRef(null);
    const itiRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        lovedOnes: [
            { name: '', age: '', gender: '', state: '', district: '', area: '', contact: '+91' }
        ],
        healthIssues: '',
        checklist: { diabetes: false, bp: false, heart: false },
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });

        if (!phoneInputRef.current) return;

        itiRef.current = intlTelInput(phoneInputRef.current, {
            initialCountry: 'in',
            separateDialCode: false,
            dropdownContainer: document.body,
            onlyCountries: [
                'in', 'us', 'ae', 'gb', 'ca', 'au', 'de', 'fr', 'sg',
                'my', 'za', 'nz', 'kw', 'sa', 'om', 'qa', 'ch', 'lk'
            ],
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.min.js',
        });

        const handleChange = () => {
            const number = itiRef.current.getNumber();
            setFormData((prev) => ({ ...prev, mobile: number }));
        };

        phoneInputRef.current.addEventListener('countrychange', handleChange);

        return () => {
            phoneInputRef.current?.removeEventListener('countrychange', handleChange);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                console.log(data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (['diabetes', 'bp', 'heart'].includes(name)) {
            setFormData({
                ...formData,
                checklist: { ...formData.checklist, [name]: checked },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleLovedOneChange = (index, field, value) => {
        const updated = [...formData.lovedOnes];
        updated[index][field] = value;
        if (field === 'state') updated[index]['district'] = '';
        setFormData({ ...formData, lovedOnes: updated });
    };

    const handleAddLovedOne = () => {
        setFormData({
            ...formData,
            lovedOnes: [...formData.lovedOnes, {
                name: '', age: '', gender: '', state: '', district: '', area: '', contact: '+91'
            }],
        });
    };

    const handleRemoveLovedOne = (index) => {
        if (index !== 0) {
            const updated = [...formData.lovedOnes];
            updated.splice(index, 1);
            setFormData({ ...formData, lovedOnes: updated });
        }
    };

    const ThankYouMessage = () => (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#229ea6] to-[#65d1ce] text-white px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Thank you!</h1>
            <p className="text-lg">Our expert will call you shortly from</p>
            <p className="text-2xl font-semibold mt-2">📞 8148809313</p>
            <p className="text-sm mt-2">between 10 AM and 8 PM. Please save the number.</p>
        </div>
    );

    if (isSubmitted) return <ThankYouMessage />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#fce4ec] p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
                <h1 className="text-5xl font-extrabold text-center text-[#d81b60] mb-10 tracking-wider font-serif">
                    🌍 NRI Enquiry Portal
                </h1>

                <form className="space-y-12" onSubmit={handleSubmit}>

                    {/* Contact Info */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-[#d81b60] pl-4">
                            <h2 className="text-2xl font-bold text-[#d81b60]">👤 Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input type="text" name="firstName" placeholder="First Name" className="fancy-input" value={formData.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last Name" className="fancy-input" value={formData.lastName} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email Address" className="fancy-input" value={formData.email} onChange={handleChange} required />
                            <input ref={phoneInputRef} type="tel" className="fancy-input md:col-span-3" placeholder="Mobile Number" required />
                        </div>
                    </section>

                    {/* Loved Ones */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-[#d81b60] pl-4">
                            <h2 className="text-2xl font-bold text-[#d81b60]">👨‍👩‍👧‍👦 Loved Ones Details</h2>
                        </div>
                        {formData.lovedOnes.map((p, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#fce4ec]/40 p-4 rounded-xl">
                                <input type="text" placeholder="Name" className="fancy-input" value={p.name} onChange={(e) => handleLovedOneChange(i, 'name', e.target.value)} />
                                <input type="number" placeholder="Age" className="fancy-input" value={p.age} onChange={(e) => handleLovedOneChange(i, 'age', e.target.value)} />
                                <select className="fancy-input" value={p.gender} onChange={(e) => handleLovedOneChange(i, 'gender', e.target.value)}>
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Contact No"
                                    className="fancy-input"
                                    value={p.contact}
                                    onChange={(e) => {
                                        let input = e.target.value;

                                        if (!input.startsWith('+91')) {
                                            input = '+91' + input.replace(/^\+*/, '').replace(/^91/, '');
                                        }

                                        const digitsOnly = input.slice(3).replace(/\D/g, '').slice(0, 10);
                                        const formatted = `+91${digitsOnly}`;

                                        handleLovedOneChange(i, 'contact', formatted);
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            (e.key === 'Backspace' || e.key === 'Delete') &&
                                            e.target.selectionStart <= 3
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <select className="fancy-input" value={p.state} onChange={(e) => handleLovedOneChange(i, 'state', e.target.value)}>
                                    <option value="">State</option>
                                    {Object.keys(india).map(state => <option key={state}>{state}</option>)}
                                </select>
                                <select className="fancy-input" value={p.district} onChange={(e) => handleLovedOneChange(i, 'district', e.target.value)}>
                                    <option value="">District</option>
                                    {p.state && india[p.state]?.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <input type="text" placeholder="Area" className="fancy-input md:col-span-2" value={p.area} onChange={(e) => handleLovedOneChange(i, 'area', e.target.value)} />
                                {formData.lovedOnes.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveLovedOne(i)} className="text-red-500 hover:text-red-700 text-lg">🗑 Remove</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddLovedOne} className="bg-[#d81b60] text-white px-6 py-2 rounded-full hover:bg-[#ad1457] shadow-lg transition">+ Add Member</button>
                    </section>

                    {/* Medical Info */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-[#d81b60] pl-4">
                            <h2 className="text-2xl font-bold text-[#d81b60]">🩺 Medical Information</h2>
                        </div>
                        <textarea name="healthIssues" placeholder="Describe health issues..." rows="4" className="fancy-input w-full" value={formData.healthIssues} onChange={handleChange} />
                        <div className="flex gap-4 flex-wrap">
                            {['diabetes', 'bp', 'heart'].map((issue) => (
                                <label key={issue} className="inline-flex items-center gap-2 bg-[#fff3f8] px-4 py-2 rounded-full shadow text-gray-700">
                                    <input type="checkbox" name={issue} checked={formData.checklist[issue]} onChange={handleChange} />
                                    {issue === 'bp' ? 'Blood Pressure' : issue.charAt(0).toUpperCase() + issue.slice(1)}
                                </label>
                            ))}
                        </div>
                    </section>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-[#d81b60] hover:bg-[#ad1457] text-white text-xl px-10 py-3 rounded-full shadow-xl hover:scale-105 transition duration-300"
                        >
                            🚀 Submit Enquiry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;