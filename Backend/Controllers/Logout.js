export function Logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: 'Unable to log out' });
        }

        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logout successful' });
    });
}
