"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="font-bold">PetLoc Admin</span>
          </Link>

          <nav className="flex gap-6">
            <Link 
              href="/admin/pets-perdidos" 
              className={`${
                pathname.includes('/admin/pets-perdidos') 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-600'
              }`}
            >
              Pets Perdidos
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900"
            >
              Voltar ao Site
            </Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}