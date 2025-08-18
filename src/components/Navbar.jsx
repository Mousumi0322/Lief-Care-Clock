import React from 'react'
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
        <div className='menuIcon'>
            <ul className='menuList'>
                
                <li><Link href="/care-worker">Care Worker</Link></li>
                <li><Link href="/manager">Manager</Link></li>

            </ul>
        </div>
    </nav>
  )
}

export default Navbar