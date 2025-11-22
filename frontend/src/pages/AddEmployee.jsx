import { useState } from 'react';
import api from '../api';
import CameraCapture from '../components/CameraCapture';
import {
  loadFaceApiModels,
  getFaceDescriptorFromImageElement,
} from '../faceApi';

export default function AddEmployee() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [expectedTime, setExpectedTime] = useState('09:00');
  const [baseSalary, setBaseSalary] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info'); // 'info' | 'error' | 'success'
  const [loading, setLoading] = useState(false);

  const isDetailsFilled = !!fullName && !!dob;
  const isWorkFilled = !!expectedTime && baseSalary !== '';
  const isPhotoReady = !!imageBase64;

  const handleCapture = (base64) => {
    setImageBase64(base64);
    setMsg('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.toString());
      setMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!isDetailsFilled || !isPhotoReady) {
      setMsgType('error');
      setMsg('Please enter name, date of birth and capture/upload a clear photo.');
      return;
    }

    try {
      setLoading(true);
      setMsgType('info');
      setMsg('Processing face, please wait…');

      // 1) Load face-api models (first time only takes some time)
      await loadFaceApiModels();

      // 2) Convert base64 to image element
      const img = new Image();
      img.src = imageBase64;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // 3) Get descriptor
      let descriptor;
      try {
        descriptor = await getFaceDescriptorFromImageElement(img);
      } catch (err) {
        console.error(err);
        setMsgType('error');
        setMsg(
          'No face detected. Please use a clear, front-facing photo with good light.'
        );
        return;
      }

      // 4) Send to backend
      const res = await api.post('/employees', {
        fullName,
        dateOfBirth: dob,
        expectedCheckIn: expectedTime,
        baseSalary: baseSalary ? Number(baseSalary) : 0,
        faceDescriptor: descriptor,   // used for face match
        photo: imageBase64,           // used for display in dashboard
      });

      console.log('Employee added:', res.data.employee);
      setMsgType('success');
      setMsg('Employee added: ' + res.data.employee.fullName);

      // 5) Clear form
      setFullName('');
      setDob('');
      setExpectedTime('09:00');
      setBaseSalary('');
      setImageBase64('');
    } catch (err) {
      console.error(err);
      setMsgType('error');
      setMsg(err.response?.data?.message || 'Error adding employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-pattern flex items-center justify-center px-4 py-6">
      {/* gradient blobs for premium look */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-64 h-64 bg-emerald-500/25 rounded-full blur-3xl absolute -top-10 -left-16 animate-subtle-float" />
        <div className="w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl absolute bottom-[-60px] right-[-30px] animate-subtle-float" />
      </div>

      <div className="w-full max-w-4xl rounded-3xl card-light shadow-xl p-5 md:p-7 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/60 flex items-center justify-center">
              <span className="text-xl">👨‍🍳</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                Add New Staff
              </h2>
              <p className="text-xs md:text-sm text-slate-600">
                Fill basic details, set shift time, then capture or upload a clear face photo.
              </p>
            </div>
          </div>

          {/* Tiny progress indicator */}
          <div className="text-xs text-slate-600">
            <div className="flex items-center gap-1 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDetailsFilled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              <span>Details</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isWorkFilled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              <span>Shift & salary</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isPhotoReady ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              <span>Photo</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width:
                    ((isDetailsFilled ? 1 : 0) +
                      (isWorkFilled ? 1 : 0) +
                      (isPhotoReady ? 1 : 0)) *
                      (100 / 3) + '%',
                }}
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
          {/* LEFT: Text fields */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm mb-1 text-slate-700">
                Full Name
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-slate-700">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                autoComplete="bday"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-slate-700">
                  Shift Start Time
                </label>
                <input
                  type="time"
                  className="w-full border rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={expectedTime}
                  onChange={(e) => setExpectedTime(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-slate-700">
                  Base Salary (per month)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  placeholder="e.g. 20000"
                  autoComplete="off"
                />
              </div>
            </div>

            {msg && (
              <p
                className={`text-xs mt-1 rounded-md px-2 py-1 ${
                  msgType === 'error'
                    ? 'text-red-700 bg-red-100 border border-red-300'
                    : msgType === 'success'
                    ? 'text-emerald-700 bg-emerald-100 border border-emerald-300'
                    : 'text-slate-700 bg-slate-100 border border-slate-300'
                }`}
              >
                {msg}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm md:text-base font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isDetailsFilled || !isPhotoReady || loading}
            >
              {loading ? 'Saving staff…' : 'Save Staff'}
              {!loading && <span>✓</span>}
            </button>
          </div>

          {/* RIGHT: Camera + upload + preview */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-sm font-medium text-slate-800 mb-2">
                Step 3: Capture or upload photo
              </p>
              <p className="text-[11px] text-slate-500 mb-2">
                Make sure the employee&apos;s face is clearly visible, looking
                straight at the camera, with good light. This helps attendance
                scanning work correctly.
              </p>

              <CameraCapture onCapture={handleCapture} />

              <p className="mt-2 text-[11px] text-gray-500 text-center">
                or choose from gallery
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 text-xs"
              />
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-3 flex flex-col items-center justify-center">
              {imageBase64 ? (
                <>
                  <p className="text-xs text-slate-600 mb-2">
                    Photo preview (used for ID & face recognition)
                  </p>
                  <img
                    src={imageBase64}
                    alt="Employee preview"
                    className="w-28 h-28 rounded-full object-cover border border-slate-300 shadow-sm"
                  />
                </>
              ) : (
                <p className="text-xs text-slate-400 text-center">
                  No photo selected yet. Use camera or upload to continue.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
