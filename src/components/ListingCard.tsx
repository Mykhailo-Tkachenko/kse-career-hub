import { Link } from 'react-router-dom'
import type { Listing } from '../types'
import { typeLabel } from '../lib/listings'

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{listing.companyLogo}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{listing.title}</h3>
            <p className="text-sm text-slate-500">{listing.company}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 whitespace-nowrap">
          {typeLabel[listing.type]}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-3 line-clamp-2">{listing.description}</p>
      <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
        <span>📍 {listing.remote ? 'Віддалено' : listing.location}</span>
        <span>🏷️ {listing.category}</span>
        <span>👥 {listing.applicants} заявок</span>
      </div>
    </Link>
  )
}
