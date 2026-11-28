import { getCurrentUser } from '../../api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';
import pdfIcon from '../../assets/pdf.svg';
import uploadIcon from '../../assets/upload.svg';
import styles from './UploadPage.module.css';

function UploadPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    async function handleUpload(formData) {
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const response = await fetch('http://localhost:8000/api/Content/uploadNotes', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.status === 401) {
                navigate('/', { replace: true });
                return;
            }
            if (!response.ok) throw new Error('Upload failed');

            setUploadSuccess('Note uploaded successfully.');
        } catch {
            setUploadError('Unable to upload your note. Please try again.');
        } finally {
            setUploading(false);
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
            setCoursesLoading(true);
            setCoursesError('');
            try {
                const response = await fetch('http://localhost:8000/api/Content/getUserCourse', {
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
                    setCoursesError('Unable to load your courses. Please refresh to try again.');
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
            <Header pageName="Upload" />
            <main className={styles.page}>
                {!isLoggedIn ? <p>Checking your session...</p> : (
                    <section className={styles.card}>
                        <div className={styles.intro}>
                            <img src={pdfIcon} alt="" />
                            <h2>Upload a Note</h2>
                            <p>Share your lecture notes with other students.</p>
                        </div>
                        <form className={styles.form} action={handleUpload}>
                            <h1>Upload a Note</h1>
                            <div className={styles.field}>
                                <label htmlFor="course">Course <span>*</span></label>
                                <select id="course" name="courseId" defaultValue="" required disabled={coursesLoading || !!coursesError || courses.length === 0}>
                                    <option value="" disabled>{coursesLoading ? 'Loading your courses...' : 'Select a course'}</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.course_code}</option>
                                    ))}
                                </select>
                                {coursesError && <p>{coursesError}</p>}
                                {!coursesLoading && !coursesError && courses.length === 0 && (
                                    <p>Register for a course in My Courses before uploading a note.</p>
                                )}
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="title">Title <span>*</span></label>
                                <input id="title" name="title" placeholder="e.g., Lecture 5 – Web Development" required />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="description">Description <span>*</span></label>
                                <textarea id="description" name="description" rows="3" placeholder="Briefly describe the contents of the note..." required />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="file">File (PDF) <span>*</span></label>
                                <input className={styles.file} id="file" name="file" type="file" accept=".pdf,application/pdf" required />
                            </div>
                            {uploadError && <p>{uploadError}</p>}
                            {uploadSuccess && <p>{uploadSuccess}</p>}
                            <button className={styles.uploadButton} type="submit" disabled={uploading || coursesLoading || !!coursesError || courses.length === 0}>
                                <img src={uploadIcon} alt="" />
                                {uploading ? 'Uploading...' : 'Upload Note'}
                            </button>
                        </form>
                    </section>
                )}
            </main>
        </>
    );
}

export default UploadPage;
