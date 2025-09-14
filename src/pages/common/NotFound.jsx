import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p>The page you're looking for doesn’t exist.</p>
      <Link to="/" style={styles.link}>Go to Home</Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  heading: {
    fontSize: '2rem',
    color: '#ff4757',
  },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    color: '#3498db',
    textDecoration: 'none',
  }
};
