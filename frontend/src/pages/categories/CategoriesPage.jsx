import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form} from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import categoryService from '../../services/categoryService';

const EMPTY_FORM = { name: '', description: '' };

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      setFiltered(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Client-side search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(categories);
    } else {
      const term = search.toLowerCase();
      setFiltered(categories.filter(c =>
        c.name.toLowerCase().includes(term) ||
        (c.description || '').toLowerCase().includes(term)
      ));
    }
  }, [search, categories]);

  // Open modal in create mode
  const handleOpenCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal in edit mode
  const handleOpenEdit = (category) => {
    setEditTarget(category);
    setForm({ name: category.name, description: category.description || '' });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Category name is required';
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setSaving(true);
    try {
      if (editTarget) {
        await categoryService.update(editTarget.id, form);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(form);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setFormErrors(serverErrors);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        breadcrumb="Categories"
        action={
          <Button variant="primary" size="sm" onClick={handleOpenCreate} className="d-flex align-items-center gap-2">
            <FiPlus /> Add Category
          </Button>
        }
      />

      <div className="table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              className="form-control form-control-sm"
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>
            {filtered.length} {filtered.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FiTag}
            title="No categories found"
            subtitle={search ? 'Try a different search term' : 'Add your first category to get started'}
            action={!search && (
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                <FiPlus className="me-1" /> Add Category
              </Button>
            )}
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, idx) => (
                  <tr key={cat.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="fw-medium">{cat.name}</td>
                    <td className="text-muted">{cat.description || '—'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" onClick={() => handleOpenEdit(cat)}>
                          <FiEdit2 />
                        </Button>
                        <Button variant="light" size="sm" className="text-danger" onClick={() => setDeleteTarget(cat)}>
                          <FiTrash2 />
                        </Button>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>
            {editTarget ? 'Edit Category' : 'Add Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Electronics"
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
            {editTarget ? 'Save Changes' : 'Create Category'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        show={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default CategoriesPage;