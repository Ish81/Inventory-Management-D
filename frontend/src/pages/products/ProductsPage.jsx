import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import supplierService from '../../services/supplierService';

const EMPTY_FORM = {
  name: '', sku: '', price: '', description: '',
  reorder_level: 0, category_id: '', supplier_id: ''
};

const ProductsPage = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers]   = useState([]);
  const [loading, setLoading]       = useState(true);

  // Filters
  const [search, setSearch]         = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');

  // Modal
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]         = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  // Load dropdown data once on mount
  useEffect(() => {
    Promise.all([categoryService.getAll(), supplierService.getAll()])
      .then(([cats, sups]) => { setCategories(cats); setSuppliers(sups); })
      .catch(() => toast.error('Failed to load form data'));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim())   params.search      = search.trim();
      if (filterCategory)  params.category_id = filterCategory;
      if (filterSupplier)  params.supplier_id = filterSupplier;
      const data = await productService.getAll(params);
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [search, filterCategory, filterSupplier]);

  // Re-fetch when any filter changes (with a small debounce on search)
  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleOpenCreate = () => {
    setEditTarget(null); setForm(EMPTY_FORM);
    setFormErrors({}); setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditTarget(p);
    setForm({
      name: p.name, sku: p.sku, price: p.price,
      description: p.description || '',
      reorder_level: p.reorder_level,
      category_id: p.category_id,
      supplier_id: p.supplier_id
    });
    setFormErrors({}); setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name       = 'Product name is required';
    if (!form.sku.trim())        e.sku        = 'SKU is required';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0)
                                  e.price      = 'Enter a valid price greater than 0';
    if (!form.category_id)        e.category_id = 'Please select a category';
    if (!form.supplier_id)        e.supplier_id = 'Please select a supplier';
    return e;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        reorder_level: parseInt(form.reorder_level) || 0,
        category_id: parseInt(form.category_id),
        supplier_id: parseInt(form.supplier_id),
      };
      if (editTarget) {
        await productService.update(editTarget.id, payload);
        toast.success('Product updated');
      } else {
        await productService.create(payload);
        toast.success('Product created');
      }
      setShowModal(false); fetchProducts();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setFormErrors(serverErrors);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      toast.success('Product deleted');
      setDeleteTarget(null); fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(false); }
  };

  const field = (key, label, props = {}) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}{props.required && <span className="text-danger"> *</span>}</Form.Label>
      <Form.Control
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        isInvalid={!!formErrors[key]}
        {...props}
      />
      <Form.Control.Feedback type="invalid">{formErrors[key]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <div>
      <PageHeader
        title="Products"
        breadcrumb="Products"
        action={
          <Button variant="primary" size="sm" onClick={handleOpenCreate} className="d-flex align-items-center gap-2">
            <FiPlus /> Add Product
          </Button>
        }
      />

      <div className="table-card">
        {/* Toolbar with search + filters */}
        <div className="table-toolbar">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input className="form-control form-control-sm" placeholder="Search products or SKU..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select form-select-sm" style={{ width: 160 }}
              value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="form-select form-select-sm" style={{ width: 160 }}
              value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}>
              <option value="">All Suppliers</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {loading ? <LoadingSpinner /> : products.length === 0 ? (
          <EmptyState icon={FiPackage} title="No products found"
            subtitle="Try adjusting your search or filters"
            action={
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                <FiPlus className="me-1" />Add Product
              </Button>
            }
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Product Name</th><th>SKU</th>
                  <th>Category</th><th>Supplier</th>
                  <th>Price</th><th>Reorder Lvl</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="fw-medium">{p.name}</td>
                    <td><span className="badge-soft-primary">{p.sku}</span></td>
                    <td><span className="badge-soft-success">{p.category_name || '—'}</span></td>
                    <td>{p.supplier_name || '—'}</td>
                    <td>₹{parseFloat(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className={parseInt(p.reorder_level) > 0 ? 'badge-soft-warning' : 'text-muted'}>
                        {p.reorder_level}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" onClick={() => handleOpenEdit(p)}><FiEdit2 /></Button>
                        <Button variant="light" size="sm" className="text-danger" onClick={() => setDeleteTarget(p)}><FiTrash2 /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>{editTarget ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>{field('name', 'Product Name', { required: true, placeholder: 'e.g. Wireless Keyboard' })}</Col>
            <Col md={4}>{field('sku', 'SKU', { required: true, placeholder: 'e.g. WK-001' })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Form.Select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                  isInvalid={!!formErrors.category_id}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.category_id}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Supplier <span className="text-danger">*</span></Form.Label>
                <Form.Select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })}
                  isInvalid={!!formErrors.supplier_id}>
                  <option value="">Select supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.supplier_id}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>{field('price', 'Price (₹)', { required: true, type: 'number', min: 0, step: '0.01', placeholder: '0.00' })}</Col>
            <Col md={6}>{field('reorder_level', 'Reorder Level', { type: 'number', min: 0, placeholder: '0' })}</Col>
            <Col md={12}>{field('description', 'Description', { as: 'textarea', rows: 2, placeholder: 'Optional product description...' })}</Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm me-1" />}
            {editTarget ? 'Save Changes' : 'Create Product'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDialog
        show={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} loading={deleting}
      />
    </div>
  );
};

export default ProductsPage;