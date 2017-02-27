import React from 'react';
import NavLink from './NavLink';
import styles from '../../../styles/cspace-ui/NavBar.css';

export default function NavBar() {
  return (
    <nav className={styles.common}>
      <ul>
        <li><NavLink to="/dashboard">My CollectionSpace</NavLink></li>
        <li><NavLink to="/create">Create New</NavLink></li>
        <li><NavLink to="/search">Search</NavLink></li>
        <li><NavLink to="/admin">Administration</NavLink></li>
      </ul>
    </nav>
  );
}
