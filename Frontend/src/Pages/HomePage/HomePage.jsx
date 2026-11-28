import { getCurrentUser } from '../../api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import NoteCard from '../../Components/NoteCard/NoteCard';
import books from '../../assets/books.svg';

import styles from './HomePage.module.css';

export function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function checkSession() {
            try {
                const user = await getCurrentUser({ signal: controller.signal });
                setUser(user);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    navigate('/', { replace: true });
                }
            }
        }

        checkSession();
        return () => controller.abort();
    }, [navigate]);

    useEffect(() => {
        if (!user) return;
        const controller = new AbortController();

        async function loadNotes() {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getUserNotes', {
                    credentials: 'include',
                    signal: controller.signal,
                });
                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                if (!response.ok) throw new Error('Unable to load your notes');

                setNotes(await response.json());
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('Unable to load your notes. Please refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadNotes();
        return () => controller.abort();
    }, [user, navigate]);

    return (
        <>
            <Header pageName="Home" />
            <main className={styles.page}>
                <section className={styles.hero} aria-labelledby="home-heading">
                    <div className={styles.content}>
                        <h1 id="home-heading">Share, Discover, and<br />Access Course Notes</h1>
                        <p>A student-driven platform to upload, find, and share
                            lecture notes, summaries, and study resources.</p>
                  
                    </div>
                    <img className={styles.books} src={books} alt="" />
                </section>
                {!user && <p>Checking your session...</p>}
                {user && (
                    <section className={styles.myNotes} aria-labelledby="my-notes-heading">
                        <h1 id="my-notes-heading">My Notes</h1>
                        {loading ? <p>Loading your notes...</p> :
                            error ? <p>{error}</p> :
                            notes.length === 0 ? <p>You haven't uploaded any notes yet.</p> : (
                                <div className={styles.notes}>
                                    {notes.map(note => <NoteCard key={note.id} note={note} />)}
                                </div>
                            )}
                    </section>
                )}
            </main>
        </>
    );
}
