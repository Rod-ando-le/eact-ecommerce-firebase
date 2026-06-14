// Orders.jsx
// Order history for the logged-in user.
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './AuthContext'
import { getUserOrders } from './orderService'

function formatDate(ms) {
  return new Date(ms).toLocaleString()
}

export default function Orders() {
  const { user } = useAuth()

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => getUserOrders(user.uid),
    enabled: !!user,
  })

  return (
    <section className="orders">
      <div className="page-head">
        <div>
          <p className="eyebrow">History</p>
          <h1 className="page-title">Your orders</h1>
        </div>
      </div>

      {isLoading && <p className="state state--loading">Loading orders…</p>}
      {isError && <p className="state state--error">Could not load orders.</p>}

      {!isLoading && orders.length === 0 && (
        <p className="state">You haven't placed any orders yet.</p>
      )}

      {orders.length > 0 && (
        <ul className="orders__list">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className="order-row">
                <div>
                  <strong className="order-row__id">Order #{order.id.slice(0, 8)}</strong>
                  <span className="order-row__date">{formatDate(order.createdAt)}</span>
                </div>
                <div className="order-row__right">
                  <span className="order-row__count">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} items
                  </span>
                  <span className="order-row__total">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
