import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import supplierService from '../../services/supplierService';

const EMPTY_FORM = { name: '', contact_person: '', email: '', phone: '', address: '' };

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
      setFiltered(data);
    } catch { toast.error('Failed to load suppliers'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(suppliers); return; }
    const term = search.toLowerCase();
    setFiltered(suppliers.filter(s =>
      s.name.toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.contact_person || '').toLowerCase().includes(term)
    ));
  }, [search, suppliers]);

  const handleOpenCreate = () => {
    setEditTarget(null); setForm(EMPTY_FORM);
    setFormErrors({}); setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditTarget(s);
    setForm({ name: s.name, contact_person: s.contact_person || '', email: s.email, phone: s.phone || '', address: s.address || '' });
    setFormErrors({}); setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Supplier name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await supplierService.update(editTarget.id, form);
        toast.success('Supplier updated');
      } else {
        await supplierService.create(form);
        toast.success('Supplier created');
      }
      setShowModal(false); fetchSuppliers();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setFormErrors(serverErrors);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await supplierService.delete(deleteTarget.id);
      toast.success('Supplier deleted');
      setDeleteTarget(null); fetchSuppliers();
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
        title="Suppliers"
        breadcrumb="Suppliers"
        action={
          <Button variant="primary" size="sm" onClick={handleOpenCreate} className="d-flex align-items-center gap-2">
            <FiPlus /> Add Supplier
          </Button>
        }
      />

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input className="form-control form-control-sm" placeholder="Search suppliers..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>
            {filtered.length} {filtered.length === 1 ? 'supplier' : 'suppliers'}
          </span>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={FiTruck} title="No suppliers found"
            subtitle={search ? 'Try a different search term' : 'Add your first supplier'}
            action={!search && <Button variant="primary" size="sm" onClick={handleOpenCreate}><FiPlus className="me-1" />Add Supplier</Button>}
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Supplier Name</th><th>Contact Person</th>
                  <th>Email</th><th>Phone</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="fw-medium">{s.name}</td>
                    <td>{s.contact_person || '—'}</td>
                    <td>{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" onClick={() => handleOpenEdit(s)}><FiEdit2 /></Button>
                        <Button variant="light" size="sm" className="text-danger" onClick={() => setDeleteTarget(s)}><FiTrash2 /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>{editTarget ? 'Edit Supplier' : 'Add Supplier'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>{field('name', 'Supplier Name', { required: true, placeholder: 'e.g. TechWorld Pvt Ltd' })}</Col>
            <Col md={6}>{field('contact_person', 'Contact Person', { placeholder: 'e.g. Rahul Sharma' })}</Col>
            <Col md={6}>{field('email', 'Email Address', { required: true, type: 'email', placeholder: 'supplier@example.com' })}</Col>
            <Col md={6}>{field('phone', 'Phone Number', { placeholder: '+91 9876543210' })}</Col>
            <Col md={12}>{field('address', 'Address', { as: 'textarea', rows: 2, placeholder: 'Full address...' })}</Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm me-1" />}
            {editTarget ? 'Save Changes' : 'Create Supplier'}
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

export default SuppliersPage;