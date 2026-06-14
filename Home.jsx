// Home.jsx
// Product listing — now powered by Firestore instead of FakeStore.
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from './productService'
import ProductCard from './ProductCard'
import CategoryFilter from './CategoryFilter'

export default function Home() {
  const [category, setCategory] = useState('all')

  // Fetch ALL products from Firestore with React Query.
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  // Build the category dropdown dynamically from the products themselves.
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  )

  // Filter client-side based on the selected category.
  const visible =
    category === 'all'
      ? products
      : products.filter((p) => p.category === category)

  return (
    <section>
      <div className="page-head">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Find your next favorite thing</h1>
        </div>
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
        />
      </div>

      {isLoading && <p className="state state--loading">Loading products…</p>}

      {isError && (
        <p className="state state--error">
          {error?.message || 'Something went wrong loading products.'}
        </p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="state">
          No products in the store yet. Log in and add some from “Manage products”.
        </p>
      )}

      {!isLoading && !isError && products.length > 0 && visible.length === 0 && (
        <p className="state">No products found in this category.</p>
      )}

      {visible.length > 0 && (
        <div className="grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
