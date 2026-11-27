// Shayan Sheikh
import styles from './NoteCard.module.css';
import { useNavigate } from 'react-router';

export default function NoteCard({ note }) {
    const navigate = useNavigate();
    return (
        <article className={styles.card} role="link" tabIndex={0}
            onClick={() => navigate(`/readNote/${note.id}`)}
            onKeyDown={event => {
                if (event.key === 'Enter') navigate(`/readNote/${note.id}`);
            }}>
            <span className={styles.course}>{note.course_code || `Course ${note.course_id}`}</span>
            <h2>{note.title}</h2>
            <p>{note.description}</p>
            <div className={styles.footer}>
                <span>PDF</span>
                <time dateTime={note.uploaded_at?.replace(' ', 'T')}>
                    {note.uploaded_at?.slice(0, 10)}
                </time>
            </div>
        </article>
    );
}
