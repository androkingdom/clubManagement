import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 bg-white text-gray-500">
      <nav className="border-b">
        <div className="px-2 font-bold flex justify-evenly items-center">
          <Link to="/" className="[&.active]:text-black">
            Home
          </Link>
          <Link to="/about" className="[&.active]:text-black">About</Link>
        </div>
      </nav>
    </header>
  )
}
