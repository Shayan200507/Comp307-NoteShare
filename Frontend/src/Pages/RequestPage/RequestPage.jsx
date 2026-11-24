import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../Components/Header/Header';

function RequestPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
