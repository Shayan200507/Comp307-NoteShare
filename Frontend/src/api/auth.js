export async function getCurrentUser({ signal } = {}) {
    const response = await fetch('http://localhost:8000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        signal,
    });

    if (!response.ok) {
        throw new Error('Unable to check your session');
    }

    return response.json();
}
