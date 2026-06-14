// OrderDetail.jsx
// Full details of a single order.
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from './orderService'

function formatDate(ms) {
  return new Date(ms).toLocaleString()
}

export default function OrderDetail() {
  const { id } = useParams()

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
  })

  if (isLoading) return <p className="state state--loading">Loading order…</p>
  if (isError || !order)
    return <p className="state state--error">Order not found.</p>

  return (
    <section className="order-detail">
      <div className="page-head">
        <div>
          <p className="eyebrow">
            <Link to="/orders">← Back to orders</Link>
          </p>
          <h1 className="page-title">Order #{order.id.slice(0, 8)}</h1>
          <p className="order-detail__date">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.id} className="order-item">
            <img
              className="order-item__img"
              src={item.image}
              alt={item.title}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://via.placeholder.com/64?text=No+Image'
              }}
            />
            <div className="order-item__info">
              <strong>{item.title}</strong>
              <span>
                {item.quantity} × ${Number(item.price).toFixed(2)}
              </span>
            </div>
            <span className="order-item__subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="order-detail__total">
        <span>Total</span>
        <span>${Number(order.total).toFixed(2)}</span>
      </div>
    </section>
  )
}
