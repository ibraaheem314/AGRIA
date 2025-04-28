import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavbarApp = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-[#0B0F0E] border-b border-neutral-800 shadow-sm">
      {/* Logo à gauche */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center cursor-pointer"
      >
        <span className="ml-2 text-xl font-semibold text-white"></span>
      </div>

      {/* Profil à droite */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-100/10 px-3 py-2 rounded-full cursor-pointer hover:bg-green-200/10 transition">
          <User className="text-green-400 w-4 h-4" />
          <span className="text-sm text-white font-medium">John Farmer</span>
        </div>
      </div>
    </header>
  );
};

export default NavbarApp;
