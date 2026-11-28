import { useState } from 'react';
import { useNavigate } from 'react-router';
import bookIcon from './icons/book.svg';
import mailIcon from './icons/mail.svg';
import lockIcon from './icons/lock.svg';
import styles from './SignupPage.module.css';

function SignupPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/signup', {
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
                    <h2 id="account-title">Create an Account</h2>
                    <p>Join NoteShare to start sharing notes.</p>
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
                        <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete="new-password" />
                    </label>
                    <label className={styles.field}>
                        <img src={lockIcon} alt="" />
                        <span className={styles.srOnly}>Confirm Password</span>
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm Password" autoComplete="new-password" />
                    </label>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                    <button className={styles.signUp} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <button type="button" className={styles.login} onClick={() => navigate('/login')}>Log In</button>
                </p>
            </section>
        </main>
    );
}

export default SignupPage;


