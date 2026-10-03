export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 text-center mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-2">&copy; {new Date().getFullYear()} Champions Club. All rights reserved.</p>
        <p className="text-sm">Premium Sports Club Management</p>
      </div>
    </footer>
  );
}
