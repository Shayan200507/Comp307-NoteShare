import { useState } from 'react';
import { useNavigate } from 'react-router';
import bookIcon from '../SignupPage/icons/book.svg';
import mailIcon from '../SignupPage/icons/mail.svg';
import lockIcon from '../SignupPage/icons/lock.svg';
import styles from './LoginPage.module.css';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit() {
        if (isSubmitting) return;

        setError('');
        setSuccess('');

        if (!email.trim() || !password) {
            setError('Email and password are required');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: email.trim(), password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            setSuccess(data.message);
            navigate('/home');
        } catch {
            setError('Unable to connect to the server');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <header className={styles.brand}>
                    <img src={bookIcon} className={styles.logo} alt="" />
                    <h1>NoteShare</h1>
                    <p>Share, discover, and access course notes</p>
                </header>

                <div className={styles.heading}>
                    <h2 id="login-title">Log In</h2>
                    <p>Welcome back to NoteShare.</p>
                </div>

                <form className={styles.form} action={handleSubmit}>
                    <label className={styles.field}>
                        <img src={mailIcon} alt="" />
                        <span className={styles.srOnly}>Email</span>
                        <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" autoComplete="email" />
                    </label>
                    <label className={styles.field}>
                        <img src={lockIcon} alt="" />
                        <span className={styles.srOnly}>Password</span>
                        <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete="current-password" />
                    </label>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                    <button className={styles.loginButton} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Don't have an account? <button type="button" className={styles.signupLink} onClick={() => navigate('/')}>Sign Up</button>
                </p>
            </section>
        </main>
    );
}

export default LoginPage;

