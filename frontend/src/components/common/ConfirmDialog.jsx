import { Modal, Button } from 'react-bootstrap';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Reusable confirmation modal.
 * Usage: <ConfirmDialog show={show} onConfirm={handleDelete} onCancel={() => setShow(false)} />
 */
const ConfirmDialog = ({
  show,
  onConfirm,
  onCancel,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) => (
  <Modal show={show} onHide={onCancel} centered size="sm">
    <Modal.Header closeButton>
      <Modal.Title style={{ fontSize: '1rem' }}>
        <FiAlertTriangle className="text-danger me-2" />
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="light" onClick={onCancel} disabled={loading} size="sm">
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={loading} size="sm">
        {loading ? <span className="spinner-border spinner-border-sm me-1" /> : null}
        {confirmLabel}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDialog;