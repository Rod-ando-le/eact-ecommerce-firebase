// ManageProducts.jsx
// Create / Update / Delete products in Firestore.
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from './productService'

const EMPTY = {
  title: '',
  price: '',
  category: '',
  description: '',
  image: '',
}

export default function ManageProducts() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  // After any change, refetch the products list everywhere
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['products'] })

  const createMutation = useMutation({ mutationFn: addProduct, onSuccess })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess,
  })
  const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess })

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  function resetForm() {
    setForm(EMPTY)
    setEditingId(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const data = {
      title: form.title,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      image: form.image,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
    resetForm()
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      title: product.title || '',
      price: product.price ?? '',
      category: product.category || '',
      description: product.description || '',
      image: product.image || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="manage">
      <div className="page-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="page-title">Manage products</h1>
        </div>
      </div>

      <form className="form form--boxed" onSubmit={handleSubmit}>
        <h2 className="manage__form-title">
          {editingId ? 'Edit product' : 'New product'}
        </h2>
        <label className="field">
          <span>Title</span>
          <input value={form.title} onChange={update('title')} required />
        </label>
        <div className="form__row">
          <label className="field">
            <span>Price</span>
            <input
              value={form.price}
              onChange={update('price')}
              type="number"
              step="0.01"
              required
            />
          </label>
          <label className="field">
            <span>Category</span>
            <input value={form.category} onChange={update('category')} required />
          </label>
        </div>
        <label className="field">
          <span>Image URL</span>
          <input value={form.image} onChange={update('image')} type="url" />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={update('description')}
            rows={3}
          />
        </label>

        <div className="form__actions">
          <button className="btn btn--primary" type="submit">
            {editingId ? 'Update product' : 'Add product'}
          </button>
          {editingId && (
            <button className="btn btn--ghost" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="manage__list-title">All products</h2>
      {isLoading ? (
        <p className="state state--loading">Loading…</p>
      ) : products.length === 0 ? (
        <p className="state">No products yet. Add your first one above.</p>
      ) : (
        <ul className="manage__list">
          {products.map((p) => (
            <li key={p.id} className="manage-row">
              <img
                className="manage-row__img"
                src={p.image}
                alt={p.title}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                }}
              />
              <div className="manage-row__info">
                <strong>{p.title}</strong>
                <span className="manage-row__meta">
                  ${Number(p.price).toFixed(2)} · {p.category}
                </span>
              </div>
              <div className="manage-row__actions">
                <button className="btn btn--ghost" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button
                  className="btn btn--danger"
                  onClick={() => deleteMutation.mutate(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
