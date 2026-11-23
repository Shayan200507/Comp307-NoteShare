import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';

function RequestPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                navigate('/', { replace: true });
            }
        }

        checkSession();
    }, [navigate]);

    return (
        <>
            <Header pageName="Request" />
            <main>
                <h1>Request</h1>
                {!isLoggedIn && <p>Checking your session...</p>}
            </main>
        </>
    );
}

export default RequestPage;
