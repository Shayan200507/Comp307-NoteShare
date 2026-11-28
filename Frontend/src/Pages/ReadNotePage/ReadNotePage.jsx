import { getCurrentUser } from '../../api/auth';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Header from '../../Components/Header/Header';
import styles from './ReadNotePage.module.css';

export default function ReadNotePage() {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState(null);
    const [dictionaryLoading, setDictionaryLoading] = useState(false);
    const [dictionaryError, setDictionaryError] = useState('');

    async function lookupWord(formData) {
        if (dictionaryLoading) return;
        const searchWord = formData.get('word').trim();
        setDictionaryError('');
        setDefinition(null);
        if (!searchWord) {
            setDictionaryError('Please enter a word');
            return;
        }

        setDictionaryLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/Content/checkDictionary/${encodeURIComponent(searchWord)}`, {
                credentials: 'include',
            });
            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setDefinition(data);
        } catch (error) {
            setDictionaryError(error.message);
        } finally {
            setDictionaryLoading(false);
        }
    }

    async function downloadNote() {
        setDownloading(true);
        setDownloadError('');
        try {
            const response = await fetch(note.pdfUrl, { credentials: 'include' });
          

            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${note.title}.pdf`;
            link.click();

            URL.revokeObjectURL(url);
        } catch {
            setDownloadError('Unable to download the PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    }

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

        async function loadNote() {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`http://localhost:8000/api/Content/retrieveFile/${encodeURIComponent(noteId)}`, {
                    credentials: 'include',
                    signal: controller.signal,
                });
                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                if (response.status === 404) {
                    setError('Note not found.');
                    return;
                }
                if (!response.ok) throw new Error('Unable to load this note. Please refresh to try again.');

                setNote(await response.json());
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('Unable to load this note. Please refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadNote();
        return () => controller.abort();
    }, [isLoggedIn, noteId, navigate]);

    return (
        <>
            <Header pageName="Browse" />
            <main className={styles.page}>
                <button className={styles.backButton} type="button" onClick={() => navigate('/browse')}>Browse More</button>
                {!isLoggedIn ? <p>Checking your session...</p> :
                    loading ? <p>Loading note...</p> :
                    error ? <p>{error}</p> : note && (
                        <div className={styles.content}>
                        <article className={styles.note}>
                            <div className={styles.noteHeader}>
                                <h1>{note.title}</h1>
                                {note.pdfUrl && (
                                    <button className={styles.backButton} type="button" onClick={downloadNote} disabled={downloading}>
                                        {downloading ? 'Downloading...' : 'Download'}
                                    </button>
                                )}
                            </div>
                            {downloadError && <p>{downloadError}</p>}
                            <p>{note.description}</p>
                            <p>Uploaded: {note.uploaded_at?.slice(0, 10)}</p>
                            {note.pdfUrl && (
                                <iframe
                                    className={styles.pdf}
                                    src={note.pdfUrl}
                                    title={`PDF: ${note.title}`}
                                />
                            )}
                        </article>
                        <aside className={styles.dictionary}>
                            <h2>Dictionary</h2>
                            <form className={styles.dictionaryForm} action={lookupWord}>
                                <label htmlFor="dictionary-word">Look up a word</label>
                                <input
                                    id="dictionary-word"
                                    name="word"
                                    value={word}
                                    onChange={event => setWord(event.target.value)}
                                    required
                                    disabled={dictionaryLoading}
                                />
                                <button className={styles.backButton} type="submit" disabled={dictionaryLoading}>
                                    {dictionaryLoading ? 'Searching...' : 'Search'}
                                </button>
                            </form>
                            {dictionaryError && <p>{dictionaryError}</p>}
                            {definition && (
                                <>
                                    <h3>{definition.word}</h3>
                                    <p>{definition.definition}</p>
                                </>
                            )}
                        </aside>
                        </div>
                    )}
            </main>
        </>
    );
}
