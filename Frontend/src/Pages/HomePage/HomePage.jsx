import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import books from '../../assets/books.svg';
import searchIcon from '../../assets/search.svg';
import styles from './HomePage.module.css';

export function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('http://localhost:8000/api/auth/me', {
                    credentials: 'include',
                });

                if (response.status === 401 || response.status === 404) {
                    navigate('/', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error('Unable to check your session');
                }

                const data = await response.json();
                setUser(data);
            } catch {
                navigate('/', { replace: true });
            }
        }

        checkSession();
    }, [navigate]);

    return (
        <>
            <Header pageName="Home" />
            <main className={styles.page}>
                <section className={styles.hero} aria-labelledby="home-heading">
                    <div className={styles.content}>
                        <h1 id="home-heading">Share, Discover, and<br />Access Course Notes</h1>
                        <p>A student-driven platform to upload, find, and share
                            lecture notes, summaries, and study resources.</p>
                        <form className={styles.search} role="search" onSubmit={(event) => {
                            event.preventDefault();
                            const query = new FormData(event.currentTarget).get('search').trim();
                            navigate(query ? `/browse?search=${encodeURIComponent(query)}` : '/browse');
                        }}>
                            <img src={searchIcon} alt="" width="20" height="20" />
                            <input
                                type="search"
                                name="search"
                                aria-label="Search for a course"
                                placeholder="Search for a course (e.g., COMP 307)"
                            />
                            <button type="submit">Search</button>
                        </form>
                    </div>
                    <img className={styles.books} src={books} alt="" />
                </section>
                {!user && <p role="status">Checking your session...</p>}
            </main>
        </>
    );
}
