import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../hooks/usePayment';
import api from '../api';
import toast from 'react-hot-toast';
import { FaUser, FaCrown, FaHistory, FaCalendarAlt, FaSignOutAlt, FaArrowLeft, FaEdit } from 'react-icons/fa';

const planColors = { none: 'text-gray-500', basic: 'text-blue-400', standard: 'text-yellow-400', premium: 'text-neon-red' };
const planNames = { none: 'No Plan', basic: 'Basic', standard: 'Standard', premium: 'Premium' };

export default function Dashboard({ onBack }) {
  const { user, logout, refreshUser } = useAuth();
  const { buyPlan, processing } = usePayment();
  const [tab, setTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, phone: user.phone || '' });
      fetchPayments();
      fetchBookings();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payment/history');
      if (data.success) setPayments(data.payments);
    } catch { /* ignore */ }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      if (data.success) setBookings(data.bookings);
    } catch { /* ignore */ }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profileForm);
      await refreshUser();
      toast.success('Profile updated');
      setEditProfile(false);
    } catch { toast.error('Update failed'); }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch { toast.error('Cancel failed'); }
  };

  const isActive = user?.membershipExpiry && new Date(user.membershipExpiry) > new Date();
  const daysLeft = isActive ? Math.ceil((new Date(user.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUser /> },
    { id: 'payments', label: 'Payments', icon: <FaHistory /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-white">My Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button onClick={() => { logout(); onBack(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-neon-red hover:bg-neon-red/5 transition-all text-sm">
            <FaSignOutAlt size={12} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Membership Card */}
            <div className="glass-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaCrown className={planColors[user?.activePlan || 'none']} />
                    <span className={`text-lg font-bold ${planColors[user?.activePlan || 'none']}`}>
                      {planNames[user?.activePlan || 'none']} Plan
                    </span>
                  </div>
                  {isActive ? (
                    <div>
                      <p className="text-gray-400 text-sm">Expires: {new Date(user.membershipExpiry).toLocaleDateString()}</p>
                      <p className="text-green-400 text-sm font-medium mt-1">✓ Active — {daysLeft} days remaining</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No active membership</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {user?.activePlan !== 'premium' && (
                    <button onClick={() => buyPlan('premium')} disabled={processing}
                      className="btn-neon !py-2.5 !px-6 text-sm disabled:opacity-50">
                      {processing ? 'Processing...' : 'Upgrade Plan'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Profile Details</h3>
                <button onClick={() => setEditProfile(!editProfile)} className="text-neon-red text-sm flex items-center gap-1 hover:text-neon-redLight">
                  <FaEdit size={12} /> {editProfile ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-3">
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} placeholder="Name"
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white focus:border-neon-red/50 focus:outline-none text-sm" />
                  <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} placeholder="Phone"
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white focus:border-neon-red/50 focus:outline-none text-sm" />
                  <button type="submit" className="btn-neon !py-2.5 !px-6 text-sm">Save Changes</button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-gray-500 text-xs uppercase tracking-wider">Name</p><p className="text-white mt-1">{user?.name}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase tracking-wider">Email</p><p className="text-white mt-1">{user?.email}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase tracking-wider">Phone</p><p className="text-white mt-1">{user?.phone || 'Not set'}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase tracking-wider">Member Since</p><p className="text-white mt-1">{new Date(user?.createdAt).toLocaleDateString()}</p></div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Payments Tab */}
        {tab === 'payments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Payment History</h3>
            </div>
            {payments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No payments yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5">
                    <th className="px-6 py-3 text-left text-gray-500 font-medium">Date</th>
                    <th className="px-6 py-3 text-left text-gray-500 font-medium">Plan</th>
                    <th className="px-6 py-3 text-left text-gray-500 font-medium">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-500 font-medium">Status</th>
                  </tr></thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-6 py-4 text-gray-300">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-white capitalize">{p.plan}</td>
                        <td className="px-6 py-4 text-white">₹{p.amount / 100}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'paid' ? 'bg-green-500/10 text-green-400' : p.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {bookings.length === 0 ? (
              <div className="glass-card p-12 text-center text-gray-500">No bookings yet</div>
            ) : bookings.map((b) => (
              <div key={b.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-white font-medium">{b.className}</h4>
                  <p className="text-gray-500 text-sm">{new Date(b.date).toLocaleDateString()} • {b.timeSlot} {b.trainer && `• ${b.trainer}`}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : b.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {b.status}
                  </span>
                  {b.status === 'confirmed' && (
                    <button onClick={() => handleCancelBooking(b.id)} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
