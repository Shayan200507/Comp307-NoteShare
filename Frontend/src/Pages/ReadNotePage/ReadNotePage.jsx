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
                if (error.name !== 'AbortError') navigate('/', { replace: true });
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
                <button className={styles.backButton} type="button" onClick={() => navigate('/browse')}>Back to Browse</button>
                {!isLoggedIn ? <p role="status">Checking your session...</p> :
                    loading ? <p role="status">Loading note...</p> :
                    error ? <p role="alert">{error}</p> : note && (
                        <article className={styles.note}>
                            <div className={styles.noteHeader}>
                                <h1>{note.title}</h1>
                                {note.pdfUrl && (
                                    <button className={styles.backButton} type="button" onClick={downloadNote} disabled={downloading}>
                                        {downloading ? 'Downloading...' : 'Download'}
                                    </button>
                                )}
                            </div>
                            {downloadError && <p role="alert">{downloadError}</p>}
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
                    )}
            </main>
        </>
    );
}
