'use client'

export function Footer() {
  return (
    <footer className="border-t border-border py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-end w-full">
        <div className="flex items-end gap-4">
          <span className="text-[140px] font-bold inline-flex items-end leading-none">
            DFF <span className="ml-1 mb-2 text-[80px] leading-none">2025</span>
          </span>
        </div>

        <div className="text-gray-500 text-right leading-tight">
          © 2025 DreamFilm Festival. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
