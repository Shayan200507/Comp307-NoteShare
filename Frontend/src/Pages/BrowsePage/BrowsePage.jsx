import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';

function BrowsePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

                setIsLoggedIn(true);
            } catch {
                setError('Unable to check your session. Please refresh to try again.');
            }
        }

        checkSession();
    }, [navigate]);

    return (
        <>
            <Header pageName="Browse" />
            <main>
                <h1>Browse</h1>
                {error ? <p>{error}</p> : !isLoggedIn && <p>Checking your session...</p>}
            </main>
        </>
    );
}

export default BrowsePage;
