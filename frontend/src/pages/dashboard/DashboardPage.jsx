import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';
import { FiPackage, FiTag, FiTruck, FiArrowRight } from 'react-icons/fi';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await productService.getDashboardStats();
        setStats(data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={4}>
          <StatCard
            label="Total Products"
            value={stats?.total_products}
            icon={FiPackage}
            color="#2d7dd2"
            bgColor="rgba(45,125,210,0.1)"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <StatCard
            label="Total Categories"
            value={stats?.total_categories}
            icon={FiTag}
            color="#38a169"
            bgColor="rgba(56,161,105,0.1)"
          />
        </Col>
        <Col xs={12} sm={6} xl={4}>
          <StatCard
            label="Total Suppliers"
            value={stats?.total_suppliers}
            icon={FiTruck}
            color="#d69e2e"
            bgColor="rgba(214,158,46,0.1)"
          />
        </Col>
      </Row>

      {/* Recent Tables */}
      <Row className="g-3">
        {/* Recent Products */}
        <Col xs={12} lg={7}>
          <div className="table-card">
            <div className="table-toolbar">
              <strong style={{ fontSize: '0.9rem' }}>Recent Products</strong>
              <Link to="/products" className="btn btn-sm btn-light d-flex align-items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_products?.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-muted py-4">No products yet</td></tr>
                  )}
                  {stats?.recent_products?.map(p => (
                    <tr key={p.id}>
                      <td className="fw-medium">{p.name}</td>
                      <td><span className="badge-soft-primary">{p.sku}</span></td>
                      <td>₹{parseFloat(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>{p.category_name || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        {/* Recent Suppliers */}
        <Col xs={12} lg={5}>
          <div className="table-card">
            <div className="table-toolbar">
              <strong style={{ fontSize: '0.9rem' }}>Recent Suppliers</strong>
              <Link to="/suppliers" className="btn btn-sm btn-light d-flex align-items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_suppliers?.length === 0 && (
                    <tr><td colSpan={2} className="text-center text-muted py-4">No suppliers yet</td></tr>
                  )}
                  {stats?.recent_suppliers?.map(s => (
                    <tr key={s.id}>
                      <td className="fw-medium">{s.name}</td>
                      <td className="text-muted">{s.contact_person || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;