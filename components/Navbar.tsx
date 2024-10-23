import Image from 'next/image';
import React from 'react';

const Navbar = () => {
  return (
    
    <div className="bg-gradient-to-r from-[#0c0c0c] to-[#0f971c] mb-20">
      <header className='flex flex-wrap justify-evenly items-center max-w-6xl mx-auto text-white'>
        <div>
          <Image src={'/YDesigns.png'} alt={'Logo'} width={40} height={40} />
        </div>
        <div className='flex-grow'>
          <nav className='container mx-auto px-4 sm:px-8 py-4 sm:py-6'>
            <ul className='flex justify-center'>
              <li className='text-center text-3xl'>Spotify Search</li>
            </ul>
          </nav>
        </div>
      </header>

    </div>
  );
};

export default Navbar;
