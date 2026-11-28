import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getCurrentUser } from '../../api/auth';
import Header from '../../Components/Header/Header';
import styles from './QuestionDetailsPage.module.css';

export default function QuestionDetailsPage() {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [commentMessage, setCommentMessage] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState('');
    const [refreshComments, setRefreshComments] = useState(0);

    async function postComment(formData) {
        if (posting) return;
        const body = formData.get('comment').trim();
        setCommentError('');
        setCommentMessage('');
        if (!body) {
            setCommentError('Enter a comment.');
            return;
        }

        setPosting(true);
        try {
            const response = await fetch('http://localhost:8000/api/Content/createResponse', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question_id: Number(questionId), body }),
            });
            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setComment('');
            setCommentMessage('Comment posted.');
            setRefreshComments(value => value + 1);
        } catch (error) {
            setCommentError(error.message);
        } finally {
            setPosting(false);
        }
    }

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

    useEffect(() => {
        if (!isLoggedIn) return;
        const controller = new AbortController();

        async function loadQuestion() {
            setLoading(true);
            setError('');
            setQuestion(null);
            try {
                const response = await fetch(`http://localhost:8000/api/Content/getQuestionDetails/${encodeURIComponent(questionId)}`, {
                    credentials: 'include',
                    signal: controller.signal,
                });
                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setQuestion(data);
            } catch (error) {
                if (error.name !== 'AbortError') setError(error.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadQuestion();
        return () => controller.abort();
    }, [isLoggedIn, questionId, navigate]);

    useEffect(() => {
        if (!isLoggedIn) return;
        const controller = new AbortController();

        async function loadComments() {
            setCommentsLoading(true);
            setCommentsError('');
            setComments([]);
            try {
                const response = await fetch(`http://localhost:8000/api/Content/getQuestionResponses/${encodeURIComponent(questionId)}`, {
                    credentials: 'include',
                    signal: controller.signal,
                });
                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setComments(data);
            } catch (error) {
                if (error.name !== 'AbortError') setCommentsError(error.message);
            } finally {
                if (!controller.signal.aborted) setCommentsLoading(false);
            }
        }

        loadComments();
        return () => controller.abort();
    }, [isLoggedIn, questionId, refreshComments, navigate]);

    return (
        <>
            <Header pageName="Discussions" />
            <main className={styles.page}>
                {!isLoggedIn ? <p>Checking your session...</p> :
                    loading ? <p>Loading question...</p> :
                    error ? <p>{error}</p> : question && (
                        <article>
                            <h1>{question.title}</h1>
                            <p>{question.course_code}</p>
                            <p>By {question.email?.split('@')[0]}</p>
                            <p className={styles.body}>{question.body}</p>
                            <hr />
                            <h2>Comments ({comments.length})</h2>
                            {commentsLoading ? <p>Loading comments...</p> :
                                commentsError ? <p>{commentsError}</p> :
                                comments.length === 0 ? <p>No comments yet.</p> : null}
                            <ul className={styles.commentList}>
                                {comments.map(comment => (
                                    <li key={comment.id}>
                                        <strong>{comment.email?.split('@')[0]}</strong>
                                        <p>{comment.body}</p>
                                    </li>
                                ))}
                            </ul>
                            <form className={styles.commentForm} action={postComment}>
                                <label htmlFor="comment">Leave a comment</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows={4}
                                    value={comment}
                                    onChange={event => setComment(event.target.value)}
                                    required
                                    disabled={posting}
                                />
                                {commentError && <p>{commentError}</p>}
                                {commentMessage && <p>{commentMessage}</p>}
                                <button type="submit" className={styles.backButton} disabled={posting}>
                                    {posting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </form>
                        </article>
                    )}
                <button type="button" className={styles.backButton} onClick={() => navigate('/discussions')}>
                    Back to Discussions
                </button>
            </main>
        </>
    );
}
