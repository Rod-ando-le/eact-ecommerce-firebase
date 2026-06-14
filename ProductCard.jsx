// src/components/ProductCard.jsx
import { useDispatch } from 'react-redux'
import { addToCart } from './cartSlice'

// Placeholder used when an image URL returns 404 (a known FakeStore API issue).
const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Image'

function handleImageError(e) {
  e.target.onerror = null // prevent an infinite loop if the placeholder fails
  e.target.src = PLACEHOLDER
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch()

  return (
    <article className="card">
      <div className="card__media">
        <img
          className="card__image"
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={handleImageError}
        />
        <span className="card__category">{product.category}</span>
      </div>

      <div className="card__body">
        <h3 className="card__title">{product.title}</h3>

        <p className="card__description">{product.description}</p>

        <div className="card__meta">
          <span className="card__rating">
            ★ {product.rating?.rate ?? 'N/A'}
            <span className="card__rating-count">
              ({product.rating?.count ?? 0})
            </span>
          </span>
          <span className="card__price">${product.price.toFixed(2)}</span>
        </div>

        <button
          className="btn btn--primary card__add"
          onClick={() => dispatch(addToCart(product))}
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
