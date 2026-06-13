import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesOrderApi } from '../../api/salesOrderApi';
import PageHeader from '../../components/common/PageHeader';
import toast from 'react-hot-toast';

const emptyItem = () => ({ product_id: '', product_name: '', product_sku: '', quantity: '', unit_price: '', available_stock: null });

const SalesOrderFormPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [items, setItems] = useState([emptyItem()]);
  const [errors, setErrors] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await salesOrderApi.getAvailableItems();
        setAvailableProducts(res.data.data);
      } catch (err) {
        toast.error('Failed to load available products');
      }
    };
    fetchProducts();
  }, []);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleProductSelect = (index, productId) => {
    const product = availableProducts.find(p => p.id.toString() === productId);
    if (product) {
      setItems(prev => prev.map((item, i) => i === index ? {
        ...item,
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        unit_price: product.price,
        available_stock: product.available_stock
      } : item));
    } else {
      setItems(prev => prev.map((item, i) => i === index ? {
        ...item,
        product_id: '',
        product_name: '',
        product_sku: '',
        unit_price: '',
        available_stock: null
      } : item));
    }
  };

  const updateItem = (index, field, value) =>
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

  const addItem = () => setItems(prev => [...prev, emptyItem()]);
  const removeItem = (index) => { if (items.length > 1) setItems(prev => prev.filter((_, i) => i !== index)); };

  const getTotal = () =>
    items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0), 0);

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Customer name is required';
    items.forEach((item, i) => {
      if (!item.product_name.trim()) errs[`item_${i}_name`] = 'Required';
      if (!item.quantity || Number(item.quantity) <= 0) {
        errs[`item_${i}_qty`] = 'Must be > 0';
      } else if (item.available_stock !== null && Number(item.quantity) > item.available_stock) {
        errs[`item_${i}_qty`] = `Max ${item.available_stock}`;
      }
      if (!item.unit_price || Number(item.unit_price) <= 0) errs[`item_${i}_price`] = 'Must be > 0';
    });
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast.error('Please fix errors'); return; }
    setSubmitting(true);
    try {
      const res = await salesOrderApi.create({
        ...form,
        items: items.map(i => ({ product_id: i.product_id || null, product_name: i.product_name, product_sku: i.product_sku || null, quantity: parseInt(i.quantity), unit_price: parseFloat(i.unit_price) })),
      });
      toast.success('Sales order created successfully!');
      navigate(`/sales-orders/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally { setSubmitting(false); }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '9px 12px',
    border: `1px solid ${hasError ? '#fca5a5' : '#e0e0e0'}`,
    borderRadius: '8px', fontSize: '13px', outline: 'none',
    background: hasError ? '#fff5f5' : '#fff',
  });

  return (
    <div>
      <PageHeader title="Create Sales Order" showBack />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px', color: '#111827' }}>Customer Information</h2>
            {[
              { field: 'customer_name', label: 'Customer Name', placeholder: 'e.g. John Smith', required: true },
              { field: 'customer_email', label: 'Email Address', placeholder: 'john@example.com' },
              { field: 'customer_phone', label: 'Phone Number', placeholder: '9876543210' },
            ].map(({ field, label, placeholder, required }) => (
              <div key={field} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
                </label>
                <input type="text" placeholder={placeholder} value={form[field]} onChange={e => updateForm(field, e.target.value)} style={inputStyle(errors[field])} />
                {errors[field] && <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px' }}>{errors[field]}</p>}
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Notes</label>
              <textarea placeholder="Optional notes..." value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3} style={{ ...inputStyle(false), resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Order Items</h2>
              <button onClick={addItem} style={{ padding: '7px 14px', fontSize: '12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '7px', cursor: 'pointer' }}>+ Add Item</button>
            </div>
            {items.map((item, index) => (
              <div key={index} style={{ border: '1px solid #f3f4f6', borderRadius: '10px', padding: '16px', marginBottom: '12px', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Item {index + 1}</span>
                  {items.length > 1 && <button onClick={() => removeItem(index)} style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Product *</label>
                    <select
                      value={item.product_id}
                      onChange={e => handleProductSelect(index, e.target.value)}
                      style={inputStyle(errors[`item_${index}_name`])}
                    >
                      <option value="">Select a product...</option>
                      {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.sku ? `(${p.sku})` : ''} - Stock: {p.available_stock}
                        </option>
                      ))}
                    </select>
                    {errors[`item_${index}_name`] && <p style={{ color: '#dc2626', fontSize: '10px', marginTop: '2px' }}>{errors[`item_${index}_name`]}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>SKU</label>
                    <input type="text" placeholder="SKU (auto)" value={item.product_sku} disabled style={{...inputStyle(false), background: '#f3f4f6'}} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Quantity *</label>
                    <input type="number" placeholder="0" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} style={inputStyle(errors[`item_${index}_qty`])} min="1" />
                    {errors[`item_${index}_qty`] && <p style={{ color: '#dc2626', fontSize: '10px', marginTop: '2px' }}>{errors[`item_${index}_qty`]}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Unit Price (₹) *</label>
                    <input type="number" placeholder="0.00" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', e.target.value)} style={inputStyle(errors[`item_${index}_price`])} min="0" step="0.01" />
                    {errors[`item_${index}_price`] && <p style={{ color: '#dc2626', fontSize: '10px', marginTop: '2px' }}>{errors[`item_${index}_price`]}</p>}
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

        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Order Summary</h3>
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Items</span>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Amount</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>₹{getTotal().toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '11px', background: submitting ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Creating...' : 'Create Sales Order'}
            </button>
            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '10px' }}>Order will be created with Draft status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderFormPage;