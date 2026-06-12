import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { auditApi } from '../../api/auditApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await auditApi.getAuditLogs();
        setLogs(response.data.data ? response.data.data : response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <>
      <PageHeader 
        title="Audit Log" 
        subtitle="Full action history across all modules"
      />

      {loading ? (
        <LoadingSpinner message="Loading audit logs..." />
      ) : logs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No Audit Logs Yet</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
            Audit logs will appear here as you perform actions in the system.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', minWidth: '200px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Create Products</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Add items to inventory</div>
            </div>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', minWidth: '200px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Manage Orders</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Create purchase/sales orders</div>
            </div>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', minWidth: '200px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Update Settings</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Modify system configuration</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entity</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#111827', fontWeight: '500' }}>
                    {log.user_email || 'System'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {log.action_type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>{log.entity_type}</span>
                    {log.entity_id && <span style={{ color: '#9ca3af', marginLeft: '4px' }}>#{log.entity_id}</span>}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '12px', color: '#4b5563', maxWidth: '300px' }}>
                    {log.details ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Object.entries(log.details).map(([k, v]) => (
                          <div key={k}>
                            <span style={{ fontWeight: '500', color: '#374151' }}>{k}:</span> {String(v)}
                          </div>
                        ))}
                      </div>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#6b7280' }}>
                    {formatDateTime(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AuditLogPage;
