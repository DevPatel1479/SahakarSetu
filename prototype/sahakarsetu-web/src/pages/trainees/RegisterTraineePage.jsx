import React, { useState } from 'react';
import { User, Briefcase, CheckCircle, ChevronRight, ChevronLeft, Loader, AlertCircle } from 'lucide-react';

// Moved outside to prevent re-mounting and losing focus on every keystroke
const InputField = ({ label, name, value, onChange, error, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${error ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-blue-100 focus:border-[#1e3a5f]'}`} 
      placeholder={placeholder} 
    />
    {error && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
  </div>
);

export default function RegisterTraineePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'M',
    category: 'General',
    state: '',
    district: '',
    cooperativeName: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredId, setRegisteredId] = useState(null);
  const [serverError, setServerError] = useState(null);

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    } else if (currentStep === 2) {
      if (!formData.cooperativeName.trim()) newErrors.cooperativeName = "Cooperative name is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.district.trim()) newErrors.district = "District is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 3));
    }
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return; // Final safety check
    
    setIsSubmitting(true);
    setServerError(null);
    try {
      const generatedId = 'SAH-2026-' + Math.floor(100000 + Math.random() * 900000).toString();
      
      const payload = {
        id: generatedId,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        category: formData.category,
        state: formData.state.trim(),
        district: formData.district.trim(),
        cooperative: formData.cooperativeName.trim(),
        attendance_pct: 0,
        assessment_score: 0,
        status: 'active',
        employed: false
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.email?.[0] || 'Failed to register trainee. Email might already exist.');
      }

      setRegisteredId(generatedId);
    } catch (error) {
      console.error("Error registering trainee:", error);
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredId) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-[#1e3a5f] mb-2">Registration Successful</h2>
        <p className="text-gray-500 font-medium mb-8">Trainee saved successfully to PostgreSQL Database</p>
        
        <div className="bg-gray-50 p-6 rounded-xl inline-block border border-gray-200 shadow-inner mb-8">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Official Sahakar ID</p>
          <p className="text-4xl font-black text-[#1e3a5f] font-mono tracking-widest drop-shadow-sm">{registeredId}</p>
        </div>
        
        <div>
          <button 
            onClick={() => { 
              setRegisteredId(null); 
              setStep(1); 
              setFormData({ firstName: '', lastName: '', email: '', phone: '', gender: 'M', category: 'General', state: '', district: '', cooperativeName: '' }); 
              setErrors({});
            }}
            className="px-8 py-3 bg-[#1e3a5f] text-white rounded-lg font-bold hover:bg-[#152a45] transition-colors shadow-md"
          >
            Register Another Trainee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight">Register New Trainee</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Trainee Registration Portal</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0" />
          <span className="font-medium text-sm">{serverError}</span>
        </div>
      )}

      <div className="flex justify-between mb-10 relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-1/2 left-4 h-1 bg-[#1e3a5f] -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded-full" style={{ width: `calc(${((step - 1) / 2) * 100}% - 2rem)` }}></div>
        
        {[
          { num: 1, label: 'Personal Info', icon: User },
          { num: 2, label: 'Cooperative Info', icon: Briefcase },
          { num: 3, label: 'Review', icon: CheckCircle }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 transition-colors duration-300 ${step >= s.num ? 'bg-[#1e3a5f] border-blue-100 text-white shadow-md' : 'bg-white border-gray-100 text-gray-300'}`}>
              <s.icon size={20} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mb-10 min-h-[320px]">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="First Name" name="firstName" placeholder="e.g. Ramesh" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
              <InputField label="Last Name" name="lastName" placeholder="e.g. Kumar" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
            </div>
            <InputField label="Email Address" name="email" type="email" placeholder="ramesh.kumar@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
            <InputField label="Phone Number" name="phone" placeholder="9999999999" value={formData.phone} onChange={handleChange} error={errors.phone} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-[#1e3a5f] focus:outline-none">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-[#1e3a5f] focus:outline-none">
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <InputField label="Cooperative Name" name="cooperativeName" placeholder="e.g. Anand Milk Union Limited" value={formData.cooperativeName} onChange={handleChange} error={errors.cooperativeName} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="State" name="state" placeholder="e.g. Maharashtra" value={formData.state} onChange={handleChange} error={errors.state} />
              <InputField label="District" name="district" placeholder="e.g. Pune" value={formData.district} onChange={handleChange} error={errors.district} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="font-extrabold text-lg text-[#1e3a5f] mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20}/> Review Trainee Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{formData.email}</p>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Demographics</p>
                  <p className="font-semibold text-gray-900">{formData.gender === 'M' ? 'Male' : formData.gender === 'F' ? 'Female' : 'Other'} - {formData.category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cooperative</p>
                  <p className="font-semibold text-gray-900">{formData.cooperativeName}</p>
                  <p className="text-sm text-gray-600">{formData.district}, {formData.state}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          onClick={handlePrev}
          disabled={step === 1 || isSubmitting}
          className={`flex items-center px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors ${step === 1 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
        >
          <ChevronLeft size={18} className="mr-2" /> Back
        </button>
        
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center px-8 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#1e3a5f] hover:bg-[#152a45] transition-colors"
          >
            Continue <ChevronRight size={18} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center px-8 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}`}
          >
            {isSubmitting ? <Loader className="animate-spin mr-2" size={18} /> : <CheckCircle size={18} className="mr-2" />}
            {isSubmitting ? 'Registering...' : 'Confirm & Register'}
          </button>
        )}
      </div>
    </div>
  );
}




