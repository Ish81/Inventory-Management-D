import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseOrderApi } from '../../api/purchaseOrderApi';
import PageHeader from '../../components/common/PageHeader';
import toast from 'react-hot-toast';

const emptyItem = () => ({ product_name: '', product_sku: '', quantity: '', unit_price: '' });

const PurchaseOrderFormPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    supplier_name: '',
    expected_delivery_date: '',
    notes: '',
  });
  const [items, setItems] = useState([emptyItem()]);
  const [errors, setErrors] = useState({});

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems(prev => [...prev, emptyItem()]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const getTotal = () =>
    items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return sum + qty * price;
    }, 0);

  const validate = () => {
    const errs = {};
    if (!form.supplier_name.trim()) errs.supplier_name = 'Supplier name is required';
    items.forEach((item, i) => {
      if (!item.product_name.trim()) errs[`item_${i}_name`] = 'Required';
      if (!item.quantity || Number(item.quantity) <= 0) errs[`item_${i}_qty`] = 'Must be > 0';
      if (!item.unit_price || Number(item.unit_price) <= 0) errs[`item_${i}_price`] = 'Must be > 0';
    });
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map(item => ({
          product_name: item.product_name,
          product_sku: item.product_sku || null,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
      };
      const res = await purchaseOrderApi.create(payload);
      toast.success('Purchase order created successfully!');
      navigate(`/purchase-orders/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '9px 12px',
    border: `1px solid ${hasError ? '#fca5a5' : '#e0e0e0'}`,
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    background: hasError ? '#fff5f5' : '#fff',
  });

  return (
    <div>
      <PageHeader title="Create Purchase Order" showBack />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Main Form */}
        <div>
          {/* Supplier Info */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px', color: '#111827' }}>Supplier Information</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Supplier Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ABC Supplies Ltd"
                value={form.supplier_name}
                onChange={e => updateForm('supplier_name', e.target.value)}
                style={inputStyle(errors.supplier_name)}
              />
              {errors.supplier_name && <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px' }}>{errors.supplier_name}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={form.expected_delivery_date}
                onChange={e => updateForm('expected_delivery_date', e.target.value)}
                style={inputStyle(false)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Notes
              </label>
              <textarea
                placeholder="Optional notes about this order..."
                value={form.notes}
                onChange={e => updateForm('notes', e.target.value)}
                rows={3}
                style={{ ...inputStyle(false), resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Items */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Order Items</h2>
              <button
                onClick={addItem}
                style={{ padding: '7px 14px', fontSize: '12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '7px', cursor: 'pointer' }}
              >
                + Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} style={{ border: '1px solid #f3f4f6', borderRadius: '10px', padding: '16px', marginBottom: '12px', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Item {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Product Name *</label>
                    <input
                      type="text"
                      placeholder="Product name"
                      value={item.product_name}
                      onChange={e => updateItem(index, 'product_name', e.target.value)}
                      style={inputStyle(errors[`item_${index}_name`])}
                    />
                    {errors[`item_${index}_name`] && <p style={{ color: '#dc2626', fontSize: '10px', marginTop: '2px' }}>{errors[`item_${index}_name`]}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>SKU</label>
                    <input
                      type="text"
                      placeholder="SKU (optional)"
                      value={item.product_sku}
                      onChange={e => updateItem(index, 'product_sku', e.target.value)}
                      style={inputStyle(false)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Quantity *</label>
                    <input
                      type="number"
                      placeholder="0"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', e.target.value)}
                      style={inputStyle(errors[`item_${index}_qty`])}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Unit Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={e => updateItem(index, 'unit_price', e.target.value)}
                      style={inputStyle(errors[`item_${index}_price`])}
                    />
                  </div>
                </div>
                {(item.quantity && item.unit_price) && (
                  <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                    Subtotal: <strong style={{ color: '#111827' }}>₹{(parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)).toFixed(2)}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Order Summary</h3>
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Items</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Amount</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>₹{getTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '11px',
                background: submitting ? '#93c5fd' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Creating...' : 'Create Purchase Order'}
            </button>
            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '10px' }}>
              Order will be created with Draft status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderFormPage;
