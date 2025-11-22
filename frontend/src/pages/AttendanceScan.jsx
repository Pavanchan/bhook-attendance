import { useEffect, useState } from 'react';
import api from '../api';
import CameraCapture from '../components/CameraCapture';
import {
  loadFaceApiModels,
  getFaceDescriptorFromImageElement,
  computeDistance,
} from '../faceApi';

export default function AttendanceScan() {
  const [employees, setEmployees] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('Loading face models…');

  useEffect(() => {
    async function init() {
      try {
        setInfo('Loading models…');
        await loadFaceApiModels();

        setInfo('Loading employees…');
        const res = await api.get('/employees');
        setEmployees(res.data || []);

        setInfo('Ready. Capture face to mark attendance.');
      } catch (err) {
        console.error(err);
        setInfo('Error loading models or employee list');
      }
    }
    init();
  }, []);

  const handleCapture = async (base64) => {
    try {
      setLoading(true);
      setResult(null);

      if (!employees.length) {
        setResult({ error: 'No employees registered yet' });
        return;
      }

      const img = new Image();
      img.src = base64;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const capturedDescriptor = await getFaceDescriptorFromImageElement(img);

      let bestEmployee = null;
      let bestDistance = Infinity;

      for (const emp of employees) {
        if (!emp.faceDescriptor || !emp.faceDescriptor.length) continue;
        const dist = computeDistance(capturedDescriptor, emp.faceDescriptor);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestEmployee = emp;
        }
      }

      const THRESHOLD = 0.5;

      if (!bestEmployee || bestDistance > THRESHOLD) {
        setResult({
          error: `Face not recognized (closest distance: ${bestDistance.toFixed(
            3
          )})`,
        });
        return;
      }

      const res = await api.post('/attendance/mark', {
        employeeId: bestEmployee._id,
      });

      setResult({
        ...res.data,
        matchDistance: bestDistance,
      });
    } catch (err) {
      console.error(err);
      setResult({
        error: err.response?.data?.message || err.message || 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-pattern p-4 flex flex-col items-center">
      <div className="w-full max-w-md rounded-2xl card-light shadow p-4 animate-fade-in-up">
        <h2 className="text-2xl font-semibold mb-4 text-center text-slate-900">
          Scan Attendance
        </h2>

        <CameraCapture onCapture={handleCapture} />

        <p className="mt-3 text-sm text-gray-700 text-center">{info}</p>

        {loading && (
          <p className="mt-2 text-blue-500 text-center">
            Recognizing face, please wait…
          </p>
        )}

        {result && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border text-center">
            {result.error ? (
              <p className="text-red-600 font-semibold">{result.error}</p>
            ) : (
              <>
                <p className="font-bold text-lg">{result.employeeName}</p>
                <p className="mt-2">
                  Status:{' '}
                  <span
                    className={
                      result.minutesLate > 5
                        ? 'text-red-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    }
                  >
                    {result.minutesLate > 5 ? 'LATE' : 'ON TIME'}
                  </span>
                </p>
                {result.minutesLate > 5 && (
                  <p className="mt-1 text-orange-500">
                    Late by {result.minutesLate} minutes
                  </p>
                )}
                {typeof result.matchDistance === 'number' && (
                  <p className="mt-2 text-xs text-gray-500">
                    Match distance: {result.matchDistance.toFixed(3)}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
