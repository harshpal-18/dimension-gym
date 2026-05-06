import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function BookingModal({ show, onClose }) {
  const { user, openAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [type, setType] = useState('group-class');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (date && type) {
      fetchSlots();
    }
  }, [date, type]);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get(`/bookings/slots?type=${type}&date=${date}`);
      if (data.success) {
        setSlots(data.slots);
        setClasses(data.classes);
        setTrainers(data.trainers);
      }
    } catch {
      toast.error('Failed to load available slots');
    }
  };

  const handleSubmit = async () => {
    if (!user) { openAuth(); onClose(); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/bookings', {
        type, className: selectedClass, trainer: selectedTrainer,
        date, timeSlot: selectedSlot, notes,
      });
      if (data.success) {
        toast.success('Booking confirmed! 📅');
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep(1); setType('group-class'); setDate(''); setSlots([]); setSelectedSlot('');
    setSelectedClass(''); setSelectedTrainer(''); setNotes('');
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><HiX size={20} /></button>

          <h2 className="text-2xl font-montserrat font-bold text-white mb-1">Book a Session</h2>
          <p className="text-gray-500 text-sm mb-6">Reserve your spot in our world-class facility</p>

          {/* Step 1: Type & Date */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Session Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['personal-training', 'group-class'].map((t) => (
                    <button key={t} onClick={() => setType(t)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${type === t ? 'bg-neon-red/20 border-neon-red/50 text-white border' : 'bg-dark-700 border border-white/5 text-gray-400 hover:border-white/10'}`}>
                      {t === 'personal-training' ? '🏋️ Personal Training' : '👥 Group Class'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Select Date</label>
                <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white focus:border-neon-red/50 focus:outline-none transition-all text-sm" />
              </div>
              <button onClick={() => { if (date) setStep(2); else toast.error('Please select a date'); }}
                className="btn-neon w-full !py-3 text-sm">Next — Select Slot</button>
            </div>
          )}

          {/* Step 2: Slot & Class */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Available Slots</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {slots.map((slot) => (
                    <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedSlot(slot.time)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${!slot.available ? 'bg-dark-700/50 text-gray-600 cursor-not-allowed' : selectedSlot === slot.time ? 'bg-neon-red/20 border-neon-red/50 text-white border' : 'bg-dark-700 border border-white/5 text-gray-300 hover:border-white/10'}`}>
                      {slot.time} {slot.available ? `(${slot.remaining} left)` : '(Full)'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Select Class</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white focus:border-neon-red/50 focus:outline-none text-sm">
                  <option value="">Choose a class</option>
                  {classes.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Preferred Trainer (optional)</label>
                <select value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white focus:border-neon-red/50 focus:outline-none text-sm">
                  <option value="">Any trainer</option>
                  {trainers.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none text-sm resize-none" />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 !py-3 text-sm">Back</button>
                <button disabled={!selectedSlot || !selectedClass || loading} onClick={handleSubmit}
                  className="btn-neon flex-1 !py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
