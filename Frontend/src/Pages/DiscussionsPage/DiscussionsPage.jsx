import { getCurrentUser } from '../../api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import styles from './DiscussionsPage.module.css';

function DiscussionsPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState('');

    async function handleCourseChange(event) {
        const courseId = event.target.value;
        setSelectedCourseId(courseId);
        setQuestions([]);
        setQuestionsError('');
        if (!courseId) return;

        setQuestionsLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/api/Content/getCourseQuestions/${encodeURIComponent(courseId)}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setQuestions(data);
        } catch (error) {
            setQuestionsError(error.message);
        } finally {
            setQuestionsLoading(false);
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

                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setCourses(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setCoursesError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) setCoursesLoading(false);
            }
        }

        loadCourses();
        return () => controller.abort();
    }, [isLoggedIn, navigate]);

    return (
        <>
            <Header pageName="Discussions" />
            <main className={styles.page}>
                <h1>NoteShare Discussions</h1>
                {!isLoggedIn && <p>Checking your session...</p>}
                {isLoggedIn && (
                    <div className={styles.field}>
                        <label htmlFor="discussion-course">Course</label>
                        <select
                            id="discussion-course"
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                            disabled={coursesLoading || questionsLoading || courses.length === 0}
                        >
                            <option value="">{coursesLoading ? 'Loading courses...' : 'Select a course'}</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.course_code}</option>
                            ))}
                        </select>
                        {coursesError && <p>{coursesError}</p>}
                        {!coursesLoading && !coursesError && courses.length === 0 && (
                            <p>Register for a course in My Courses to join discussions.</p>
                        )}
                    </div>
                )}
                {isLoggedIn && (
                    <button
                        type="button"
                        className={styles.newPostButton}
                        disabled={!selectedCourseId}
                        onClick={() => {
                            const course = courses.find(course => String(course.id) === selectedCourseId);
                            if (course) navigate(`/create-post/${encodeURIComponent(course.course_code)}`);
                        }}
                    >+ New Post</button>
                )}
                {isLoggedIn && selectedCourseId && (
                    <section className={styles.questions} aria-labelledby="questions-heading">
                        <h2 id="questions-heading">Questions</h2>
                        {questionsLoading && <p>Loading questions...</p>}
                        {questionsError && <p>{questionsError}</p>}
                        {!questionsLoading && !questionsError && questions.length === 0 && (
                            <p>No questions for this course yet.</p>
                        )}
                        <ul className={styles.questionList}>
                            {questions.map(question => (
                                <li key={question.id} className={styles.question}>
                                    <h3>{question.title}</h3>
                                    <p>By {question.email?.split('@')[0] }</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </>
    );
}

export default DiscussionsPage;
