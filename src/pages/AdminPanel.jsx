import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaChartBar, FaArrowLeft, FaSignOutAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function AdminPanel({ onBack }) {
  const { logout } = useAuth();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPayments();
    fetchBookings();
  }, []);

  const fetchStats = async () => {
    try { const { data } = await api.get('/admin/stats'); if (data.success) setStats(data.stats); } catch { /* */ }
  };
  const fetchUsers = async () => {
    try { const { data } = await api.get('/admin/users?limit=50'); if (data.success) setUsers(data.users); } catch { /* */ }
  };
  const fetchPayments = async () => {
    try { const { data } = await api.get('/admin/payments?limit=50'); if (data.success) setPayments(data.payments); } catch { /* */ }
  };
  const fetchBookings = async () => {
    try { const { data } = await api.get('/admin/bookings?limit=50'); if (data.success) setBookings(data.bookings); } catch { /* */ }
  };

  const toggleUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle`);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  const updateMembership = async (id, plan) => {
    try {
      await api.put(`/admin/users/${id}/membership`, { activePlan: plan, durationDays: 30 });
      toast.success('Membership updated');
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  const tabs = [
    { id: 'stats', label: 'Overview', icon: <FaChartBar /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'payments', label: 'Payments', icon: <FaMoneyBillWave /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-white">Admin Panel</h1>
              <p className="text-gray-500 text-sm">Manage your gym business</p>
            </div>
          </div>
          <button onClick={() => { logout(); onBack(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-neon-red transition-all text-sm">
            <FaSignOutAlt size={12} /> Logout
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        {tab === 'stats' && stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers, color: 'text-blue-400' },
                { label: 'Active Members', value: stats.activeMembers, color: 'text-green-400' },
                { label: 'Total Payments', value: stats.totalPayments, color: 'text-yellow-400' },
                { label: 'Revenue', value: `₹${(stats.totalRevenue / 100).toLocaleString()}`, color: 'text-neon-red' },
                { label: 'Bookings', value: stats.totalBookings, color: 'text-purple-400' },
              ].map((s, i) => (
                <div key={i} className="glass-card p-5">
                  <p className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</p>
                  <p className={`text-2xl font-montserrat font-bold mt-2 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-4">Plan Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                {stats.planDistribution.map((p) => (
                  <div key={p._id} className="bg-dark-700 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-xs uppercase">{p._id}</p>
                    <p className="text-2xl font-bold text-white mt-1">{p.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-left text-gray-500">Expiry</th>
                  <th className="px-4 py-3 text-left text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-gray-500">Actions</th>
                </tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-white">{u.name}</td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3 capitalize text-white">{u.activePlan}</td>
                      <td className="px-4 py-3 text-gray-400">{u.membershipExpiry ? new Date(u.membershipExpiry).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select onChange={(e) => { if (e.target.value) updateMembership(u.id, e.target.value); }} defaultValue=""
                            className="bg-dark-700 text-xs text-gray-300 rounded px-2 py-1 border border-white/5">
                            <option value="" disabled>Set Plan</option>
                            <option value="none">None</option>
                            <option value="basic">Basic</option>
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                          </select>
                          <button onClick={() => toggleUser(u.id)} title="Toggle status">
                            {u.isActive ? <FaToggleOn className="text-green-400" size={18} /> : <FaToggleOff className="text-gray-500" size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Payments */}
        {tab === 'payments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-left text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-gray-500">Payment ID</th>
                </tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-gray-300">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-white">{p.user?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 capitalize text-white">{p.plan}</td>
                      <td className="px-4 py-3 text-white">₹{p.amount / 100}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'paid' ? 'bg-green-500/10 text-green-400' : p.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{p.razorpayPaymentId || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Bookings */}
        {tab === 'bookings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-gray-500">Class</th>
                  <th className="px-4 py-3 text-left text-gray-500">Time</th>
                  <th className="px-4 py-3 text-left text-gray-500">Trainer</th>
                  <th className="px-4 py-3 text-left text-gray-500">Status</th>
                </tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-gray-300">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-white">{b.user?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-white">{b.className}</td>
                      <td className="px-4 py-3 text-gray-400">{b.timeSlot}</td>
                      <td className="px-4 py-3 text-gray-400">{b.trainer || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
