import { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { billingAPI, appointmentAPI } from '../services/ApiService';
import toast from 'react-hot-toast';
import { getUser } from '../utils/helpers';
import { LoadingSpinner, Modal, Button, FormInput, FormSelect, Card, EmptyState } from '../components/UIComponents';
import { formatCurrency, formatDate } from '../utils/helpers';

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Credit/Debit Card' },
  { value: 'INSURANCE', label: 'Insurance' },
];

export default function Billing() {
  const user = getUser();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [form, setForm] = useState({
    appointmentId: '',
    totalAmount: '',
    tax: '0',
    paymentMethod: 'CARD',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let invoicesRes;
      if (user?.role === 'PATIENT') {
        invoicesRes = await billingAPI.getMyInvoices();
      } else {
        invoicesRes = await billingAPI.getAll();
      }

      let appointmentsRes = { data: [] };
      if (user?.role === 'ADMIN') {
        appointmentsRes = await appointmentAPI.getAll().catch(() => ({ data: [] }));
      }

      setInvoices(invoicesRes.data || []);
      setAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.id.toString().includes(searchTerm) ||
          inv.appointmentId?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((inv) => inv.paymentStatus === filterStatus);
    }

    setFilteredInvoices(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.appointmentId) newErrors.appointmentId = 'Appointment is required';
    if (!form.totalAmount || parseFloat(form.totalAmount) <= 0)
      newErrors.totalAmount = 'Amount must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const selectedAppt = appointments.find((a) => a.id === parseInt(form.appointmentId));
      await billingAPI.create({
        appointmentId: parseInt(form.appointmentId),
        patientId: selectedAppt?.patientId,
        totalAmount: parseFloat(form.totalAmount),
        tax: parseFloat(form.tax) || 0,
        paymentMethod: form.paymentMethod,
      });
      toast.success('Invoice created successfully');
      setShowForm(false);
      setForm({ appointmentId: '', totalAmount: '', tax: '0', paymentMethod: 'CARD' });
      setErrors({});
      fetchData();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await billingAPI.markPaid(id);
      toast.success('Invoice marked as paid');
      fetchData();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const handlePay = async (id) => {
    try {
      await billingAPI.payInvoice(id, 'CARD');
      toast.success('Payment successful!');
      fetchData();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PAID: 'bg-green-100 text-green-700',
      UNPAID: 'bg-red-100 text-red-700',
      PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const calculateTotal = () => {
    return invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  };

  const calculatePending = () => {
    return invoices
      .filter((inv) => inv.paymentStatus !== 'PAID')
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 text-sm mt-1">Manage invoices and payments</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{invoices.length}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(calculateTotal())}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{formatCurrency(calculatePending())}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      {invoices.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice ID or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
            </select>
          </div>
        </Card>
      )}

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setForm({ appointmentId: '', totalAmount: '', tax: '0', paymentMethod: 'CARD' });
          setErrors({});
        }}
        title="Create Invoice"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormSelect
            label="Select Appointment"
            options={appointments
              .filter((a) => a.status === 'COMPLETED')
              .map((a) => ({
                value: a.id,
                label: `Appt #${a.id} - Patient ${a.patientId} (Dr ${a.doctorId})`,
              }))}
            value={form.appointmentId}
            onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
            error={errors.appointmentId}
            required
          />

          <FormInput
            label="Total Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.totalAmount}
            onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
            error={errors.totalAmount}
            required
          />

          <FormInput
            label="Tax Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.tax}
            onChange={(e) => setForm({ ...form, tax: e.target.value })}
          />

          <FormSelect
            label="Payment Method"
            options={PAYMENT_METHODS}
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
              {submitting ? 'Creating...' : 'Create Invoice'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setForm({ appointmentId: '', totalAmount: '', tax: '0', paymentMethod: 'CARD' });
                setErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Invoices"
          description={
            searchTerm || filterStatus !== 'all'
              ? 'No invoices match your search'
              : 'No invoices found'
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Invoice #</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Appointment</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Tax</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Method</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Appt #{invoice.appointmentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{formatCurrency(invoice.totalAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(invoice.tax)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      {formatCurrency(parseFloat(invoice.totalAmount) + parseFloat(invoice.tax))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.paymentStatus)}`}>
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        {user?.role === 'PATIENT' && invoice.paymentStatus === 'UNPAID' && (
                          <button
                            onClick={() => handlePay(invoice.id)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-xs font-medium"
                          >
                            Pay Now
                          </button>
                        )}
                        {(user?.role === 'ADMIN' || user?.role === 'EMPLOYEE') && invoice.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => handleMarkPaid(invoice.id)}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 text-xs font-medium"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
            Showing {filteredInvoices.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
          </div>
        </Card>
      )}
    </div>
  );
}
