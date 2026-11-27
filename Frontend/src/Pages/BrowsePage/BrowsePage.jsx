// Shayan Sheikh
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import NoteCard from '../../Components/NoteCard/NoteCard';
import styles from './BrowsePage.module.css';

function BrowsePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function checkSession() {
            try {
                const response = await fetch('http://localhost:8000/api/auth/me', {
                    credentials: 'include',
                    signal: controller.signal,
                });

                if (!response.ok) {
                    navigate('/', { replace: true });
                    return;
                }


                setIsLoggedIn(true);
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
        if (!isLoggedIn) return;
        const controller = new AbortController();

        async function loadNotes() {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getAllNotes', {
                    credentials: 'include',
                    signal: controller.signal,
                });

                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                if (!response.ok) throw new Error('Unable to load notes');

                setNotes(await response.json());
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('Unable to load notes. Please refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadNotes();
        return () => controller.abort();
    }, [isLoggedIn, navigate]);

    return (
        <>
            <Header pageName="Browse" />
            <main className={styles.page}>
                <h1>Browse Notes</h1>
                {!isLoggedIn ? <p role="status">Checking your session...</p> :
                    loading ? <p role="status">Loading notes...</p> :
                    error ? <p role="alert">{error}</p> :
                    notes.length === 0 ? <p>No notes have been uploaded yet.</p> : (
                        <div className={styles.notes}>
                            {notes.map(note => <NoteCard key={note.id} note={note} />)}
                        </div>
                    )}
            </main>
        </>
    );
}

export default BrowsePage;
