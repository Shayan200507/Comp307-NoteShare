import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getCurrentUser } from '../../api/auth';
import Header from '../../Components/Header/Header';
import styles from './CreatePostPage.module.css';

export default function CreatePostPage() {
    const { courseCode } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function checkSession() {
            try {
                await getCurrentUser({ signal: controller.signal });
                setIsLoggedIn(true);
            } catch (error) {
                if (error.name !== 'AbortError') navigate('/', { replace: true });
            }
        }

        checkSession();
        return () => controller.abort();
    }, [navigate]);

    async function createPost(formData) {
        if (submitting) return;
        setError('');
        const postTitle = formData.get('title').trim();
        const postBody = formData.get('body').trim();
        if (!postTitle || !postBody) {
            setError('Enter a title and post content.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:8000/api/Content/createQuestion', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_code: courseCode, title: postTitle, body: postBody }),
            });
            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            navigate('/discussions', { replace: true });
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Header pageName="Discussions" />
            <main className={styles.page}>
                <h1>New Post</h1>
                <p>{courseCode}</p>
                {!isLoggedIn ? <p>Checking your session...</p> : (
                        <form className={styles.form} action={createPost}>
                            <label htmlFor="post-title">Title (required)</label>
                            <input id="post-title" name="title" value={title} onChange={event => setTitle(event.target.value)} required disabled={submitting} />
                            <label htmlFor="post-body">Post</label>
                            <textarea id="post-body" name="body" rows={8} value={body} onChange={event => setBody(event.target.value)} required disabled={submitting} />
                            {error && <p>{error}</p>}
                            <button type="submit" disabled={submitting}>{submitting ? 'Posting...' : 'Create Post'}</button>
                        </form>
                    )}
                <button type="button" className={styles.backButton} onClick={() => navigate('/discussions')}>Back to Discussions</button>
            </main>
        </>
    );
}
