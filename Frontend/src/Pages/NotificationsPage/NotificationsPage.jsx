import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import NoteCard from '../../Components/NoteCard/NoteCard';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [notifications, setNotifications] = useState([]);
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
                const user = await response.json();
                setUserId(user.id);
            } catch (error) {
                if (error.name !== 'AbortError') navigate('/', { replace: true });
            }
        }

        checkSession();
        return () => controller.abort();
    }, [navigate]);

    useEffect(() => {
        if (userId === null) return;
        const controller = new AbortController();

        async function loadNotifications() {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getUserNotifications', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                    signal: controller.signal,
                });

                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                if (!response.ok) throw new Error('Unable to load notifications');

                setNotifications(await response.json());
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('Unable to load notifications. Please refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadNotifications();
        return () => controller.abort();
    }, [userId, navigate]);

    return (
        <>
            <Header pageName="Notifications" />
            <main className={styles.page}>
                <h1>Notifications</h1>
                {userId === null ? <p role="status">Checking your session...</p> :
                    loading ? <p role="status">Loading notifications...</p> :
                    error ? <p role="alert">{error}</p> :
                    notifications.length === 0 ? <p>No notifications yet.</p> : (
                        <ul className={styles.list}>
                            {notifications.map(notification => (
                                <li key={notification.id}>
                                    <NoteCard note={{
                                        id: notification.note_id,
                                        title: notification.title,
                                        description: notification.description,
                                        course_id: notification.course_id,
                                        course_code: notification.course_code,
                                        uploaded_at: notification.uploaded_at,
                                    }} />
                                </li>
                            ))}
                        </ul>
                    )}
            </main>
        </>
    );
}
