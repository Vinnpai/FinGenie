import React from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="bg-primary text-light shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-2xl font-bold">AI Goal Planner</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-secondary hover:bg-red-600 rounded-lg transition-colors font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="text-sm text-accent">
                Create goals without login or sign up to save them
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
