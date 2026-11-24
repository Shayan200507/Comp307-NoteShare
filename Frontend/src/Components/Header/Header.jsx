import { useState } from 'react';
import { useNavigate } from 'react-router';
import bookIcon from '../../Pages/SignupPage/icons/book.svg';
import styles from './Header.module.css';

function Header({ pageName = 'Home' }) {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const pages = ['Home', 'Browse', 'Upload', 'Request'];

    async function logout() {
        setLoggingOut(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            window.location.reload();
        } catch {
            setError('Unable to log out. Please try again.');
            setLoggingOut(false);
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <img src={bookIcon} alt="" />
                <span>NoteShare</span>
            </div>

            <nav className={styles.navigation}>
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`${styles.link} ${pageName.toLowerCase() === page.toLowerCase() ? styles.active : ''}`}
                        onClick={() => navigate(`/${page.toLowerCase()}`)}
                    >
                        {page}
                    </button>
                ))}
            </nav>
            <button className={styles.logout} type="button" onClick={logout} disabled={loggingOut}>
                {loggingOut ? 'Logging out...' : 'Log out'}
            </button>
            <div className={styles.menu}>
                <button
                    type="button"
                    className={styles.menuToggle}
                    aria-label="My notes menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span />
                    <span />
                    <span />
                </button>
                {menuOpen && <div className={styles.dropdown}>
                    <button type="button" onClick={() => {
                        setMenuOpen(false);
                        navigate('/my-courses');
                    }}>My Courses</button>
                    <button type="button" disabled title="My Uploads is not available yet">My Uploads</button>
                    <button type="button" disabled title="Saved Notes is not available yet">Saved Notes</button>
                    <button type="button" onClick={() => {
                        setMenuOpen(false);
                        navigate('/notifications');
                    }}>Notifications</button>
                </div>}
            </div>
            {error && <p role="alert">{error}</p>}
        </header>
    );
}

export default Header;
