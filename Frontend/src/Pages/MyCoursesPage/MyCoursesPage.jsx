import { getCurrentUser } from '../../api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import styles from './MyCoursesPage.module.css';

export default function MyCoursesPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [allCoursesLoading, setAllCoursesLoading] = useState(true);
    const [allCoursesError, setAllCoursesError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState(null);
    const [removeError, setRemoveError] = useState('');
    const [addingId, setAddingId] = useState(null);
    const [addError, setAddError] = useState('');
    const [refresh, setRefresh] = useState(0);
    const availableCourses = allCourses.filter(course =>
        !courses.some(registered => registered.id === course.id)
    );

    async function addCourse(courseId) {
        setAddingId(courseId);
        setAddError('');

        try {
            const response = await fetch('http://localhost:8000/api/Content/registerCourses', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            });

            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }
            if (!response.ok) throw new Error('Unable to register for this course.');

            setRefresh(current => current + 1);
        } catch {
            setAddError('Unable to register for this course. Please try again.');
        } finally {
            setAddingId(null);
        }
    }

    async function removeCourse(courseId) {
        setRemovingId(courseId);
        setRemoveError('');

        try {
            const response = await fetch('http://localhost:8000/api/Content/removeCourses', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            });

            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }
            if (!response.ok) throw new Error('Unable to remove this course.');

            setCourses(current => current.filter(course => course.id !== courseId));
            setRefresh(current => current + 1);
        } catch {
            setRemoveError('Unable to remove this course. Please try again.');
        } finally {
            setRemovingId(null);
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

        async function loadCourses() {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getUserCourse', {
                    method: 'GET',
                    credentials: 'include',
                    signal: controller.signal,
                });

                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                if (!response.ok) throw new Error('Unable to load your courses.');

                setCourses(await response.json());
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('Unable to load your courses. Please refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadCourses();
        return () => controller.abort();
    }, [navigate, isLoggedIn, refresh]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadAllCourses() {
            setAllCoursesLoading(true);
            setAllCoursesError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getAllCourses', {
                    credentials: 'include',
                    signal: controller.signal,
                });

                if (response.status === 401) {
                    navigate('/', { replace: true });
                    return;
                }
                if (!response.ok) throw new Error('Unable to load available courses.');

                setAllCourses(await response.json());
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setAllCoursesError('Unable to load available courses. Please refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setAllCoursesLoading(false);
            }
        }

        loadAllCourses();
        return () => controller.abort();
    }, [navigate, refresh]);

    return (
        <>
            <Header pageName="My Courses" />
            <main className={styles.page}>
                <button className={styles.backButton} type="button" onClick={() => navigate('/home')}>
                    Back to Home
                </button>
                <h1>My Courses</h1>
                {removeError && <p>{removeError}</p>}
                {loading ? <p>Loading your courses...</p> :
                    error ? <p>{error}</p> :
                    courses.length === 0 ? <p>You haven't registered for any courses yet.</p> : (
                        <ul className={styles.courses}>
                            {courses.map((course) => (
                                <li key={course.id}>
                                    <span>{course.course_code}</span>
                                    <button
                                        className={styles.removeButton}
                                        type="button"
                                        disabled={removingId !== null || addingId !== null}
                                        aria-label={`Remove ${course.course_code}`}
                                        onClick={() => removeCourse(course.id)}
                                    >
                                        {removingId === course.id ? 'Removing...' : 'Remove'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                {!loading && !error && (
                    <section>
                        <h2>Available Courses</h2>
                        {addError && <p>{addError}</p>}
                        {allCoursesLoading ? <p>Loading available courses...</p> :
                            allCoursesError ? <p>{allCoursesError}</p> :
                            availableCourses.length === 0 ? <p>No more courses available to register for.</p> : (
                            <ul className={styles.courses}>
                                {availableCourses.map(course => (
                                    <li key={course.id}>
                                        <span>{course.course_code}</span>
                                        <button
                                            className={styles.removeButton}
                                            type="button"
                                            disabled={addingId !== null || removingId !== null}
                                            aria-label={`Add ${course.course_code}`}
                                            onClick={() => addCourse(course.id)}
                                        >
                                            {addingId === course.id ? 'Adding...' : 'Add'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>
        </>
    );
}
