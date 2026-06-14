// CategoryFilter.jsx
// Dropdown of categories. Options are passed in from Home (derived from
// the products in Firestore) — nothing is hard coded.
export default function CategoryFilter({ categories = [], value, onChange }) {
  return (
    <div className="category-filter">
      <label htmlFor="category" className="category-filter__label">
        Category
      </label>
      <select
        id="category"
        className="category-filter__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All products</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}
