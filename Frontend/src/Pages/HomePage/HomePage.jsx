import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';

export function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('http://localhost:8000/api/auth/me', {
                    credentials: 'include',
                });

                if (response.status === 401 || response.status === 404) {
                    navigate('/', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error('Unable to check your session');
                }

                const data = await response.json();
                setUser(data);
            } catch {
                setError('Unable to check your session. Please refresh to try again.');
            }
        }

        checkSession();
    }, [navigate]);

    return (
        <>
        <Header pageName="Home" />
        <main>
            <h1>Home</h1>
            {error ? <p>{error}</p> : user ? (
                <p>Welcome, {user.email.split('@')[0]}</p>
            ) : <p>Checking your session...</p>}
        </main>
        </>
    );
}
