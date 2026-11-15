import { useNavigate } from 'react-router';
import bookIcon from '../../Pages/SignupPage/icons/book.svg';
import styles from './Header.module.css';

function Header({ pageName = 'Home' }) {
    const navigate = useNavigate();
    const pages = ['Home', 'Browse', 'Upload', 'Request'];

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
        </header>
    );
}

export default Header;
