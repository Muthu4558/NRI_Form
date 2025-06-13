import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaUser, FaHeartbeat, FaUsers } from 'react-icons/fa';

const Home = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        lovedOnes: [{ name: '', age: '', gender: '', city: '', contact: '' }],
        healthIssues: '',
        checklist: { diabetes: false, bp: false, heart: false },
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/form/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                alert("Submission failed");
                console.log(data);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (['diabetes', 'bp', 'heart'].includes(name)) {
            setFormData({ ...formData, checklist: { ...formData.checklist, [name]: checked } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleLovedOneChange = (index, field, value) => {
        const updated = [...formData.lovedOnes];
        updated[index][field] = value;
        setFormData({ ...formData, lovedOnes: updated });
    };

    const handleAddLovedOne = () => {
        setFormData({
            ...formData,
            lovedOnes: [...formData.lovedOnes, { name: '', age: '', gender: '', city: '', contact: '' }]
        });
    };

    const ThankYouMessage = () => (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#229ea6] text-white px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Thank you!</h1>
            <p className="text-lg">Our expert will call you shortly from</p>
            <p className="text-2xl font-semibold mt-2">📞 8148809313</p>
            <p className="text-sm mt-2">between 10 AM and 8 PM. Please save the number.</p>
        </div>
    );

    if (isSubmitted) return <ThankYouMessage />;

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#d1f2f0] via-white to-[#c9eaf0] p-6">
            <div className="max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md p-10" data-aos="fade-up">
                <h1 className="text-4xl font-bold text-center text-[#229ea6] mb-10 tracking-wide">💖 Health Assistance Form</h1>

                <form className="space-y-10" onSubmit={handleSubmit}>
                    <section data-aos="fade-right">
                        <h2 className="flex items-center text-2xl font-semibold mb-4 text-[#229ea6]"><FaUser className="mr-2" /> Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="firstName" placeholder="First Name" className="form-input-style" value={formData.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last Name" className="form-input-style" value={formData.lastName} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email Address" className="form-input-style" value={formData.email} onChange={handleChange} required />
                            <input type="text" name="mobile" placeholder="Mobile Number" className="form-input-style" value={formData.mobile} onChange={handleChange} required />
                        </div>
                    </section>

                    <section data-aos="fade-left">
                        <h2 className="flex items-center text-2xl font-semibold mb-4 text-[#229ea6]"><FaUsers className="mr-2" /> Loved Ones</h2>

                        {formData.lovedOnes.map((person, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                                <input type="text" placeholder="Name" className="form-input-style" value={person.name} onChange={(e) => handleLovedOneChange(i, 'name', e.target.value)} />
                                <input type="text" placeholder="Age" className="form-input-style" value={person.age} onChange={(e) => handleLovedOneChange(i, 'age', e.target.value)} />
                                <select className="form-input-style" value={person.gender} onChange={(e) => handleLovedOneChange(i, 'gender', e.target.value)}>
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <input type="text" placeholder="City" className="form-input-style" value={person.city} onChange={(e) => handleLovedOneChange(i, 'city', e.target.value)} />
                                <input type="text" placeholder="Indian Contact Number" className="form-input-style" value={person.contact} onChange={(e) => handleLovedOneChange(i, 'contact', e.target.value)} />
                            </div>
                        ))}

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleAddLovedOne}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#229ea6] text-white text-sm shadow hover:scale-105 transform transition"
                            >
                                + Add Another Member
                            </button>
                        </div>
                    </section>

                    <section data-aos="fade-up">
                        <h2 className="flex items-center text-2xl font-semibold mb-4 text-[#229ea6]"><FaHeartbeat className="mr-2" /> Medical Info</h2>
                        <textarea name="healthIssues" placeholder="Any health issues?" rows="4" className="form-input-style w-full" value={formData.healthIssues} onChange={handleChange} />
                        <div className="flex flex-wrap gap-6 mt-4 text-sm">
                            {['diabetes', 'bp', 'heart'].map(issue => (
                                <label key={issue} className="flex items-center gap-2 bg-[#f0fbfa] px-4 py-2 rounded-full shadow text-gray-700">
                                    <input type="checkbox" name={issue} checked={formData.checklist[issue]} onChange={handleChange} />
                                    {issue === 'bp' ? 'Blood Pressure' : issue.charAt(0).toUpperCase() + issue.slice(1)}
                                </label>
                            ))}
                        </div>
                    </section>

                    <div className="text-center" data-aos="zoom-in">
                        <button
                            type="submit"
                            className="mt-10 bg-[#229ea6] hover:bg-[#1b7f83] text-white text-lg px-10 py-3 rounded-full shadow-xl hover:scale-105 transform transition duration-300"
                        >
                            Submit Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
