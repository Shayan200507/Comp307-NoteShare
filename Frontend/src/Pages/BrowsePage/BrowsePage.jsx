import { getCurrentUser } from '../../api/auth';
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
    const [search, setSearch] = useState('');

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.course_code?.toLowerCase().includes(search.toLowerCase()) ||
        note.description.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const controller = new AbortController();

        async function checkSession() {
            try {
                await getCurrentUser({ signal: controller.signal });
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
                <div className={styles.heading}>
                    <h1>Browse Notes</h1>
                    <input
                        className={styles.search}
                        type="search"
                        aria-label="Search notes"
                        placeholder="Search notes..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </div>
                {!isLoggedIn ? <p>Checking your session...</p> :
                    loading ? <p>Loading notes...</p> :
                    error ? <p>{error}</p> :
                    notes.length === 0 ? <p>No notes have been uploaded yet.</p> :
                    filteredNotes.length === 0 ? <p>No matching notes found.</p> : (
                        <div className={styles.notes}>
                            {filteredNotes.map(note => <NoteCard key={note.id} note={note} />)}
                        </div>
                    )}
            </main>
        </>
    );
}

export default BrowsePage;
