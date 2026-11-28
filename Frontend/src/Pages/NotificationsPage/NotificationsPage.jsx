import { getCurrentUser } from '../../api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import NoteCard from '../../Components/NoteCard/NoteCard';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function deleteNotification(notificationId) {
        try {
            const response = await fetch('http://localhost:8000/api/Content/deleteNotification', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ NotificationId: notificationId }),
            });

            if (!response.ok) throw new Error('Unable to delete notification');
        } catch (error) {
            console.error('Unable to delete notification:', error);
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

        async function loadNotifications() {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getUserNotifications', {
                    method: 'GET',
                    credentials: 'include',
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
    }, [isLoggedIn, navigate]);

    return (
        <>
            <Header pageName="Notifications" />
            <main className={styles.page}>
                <h1>Notifications</h1>
                {!isLoggedIn ? <p>Checking your session...</p> :
                    loading ? <p>Loading notifications...</p> :
                    error ? <p>{error}</p> :
                    notifications.length === 0 ? <p>No notifications yet.</p> : (
                        <ul className={styles.list}>
                            {notifications.map(notification => (
                                <li key={notification.id}
                                    onClick={() => deleteNotification(notification.id)}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter') deleteNotification(notification.id);
                                    }}>
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
