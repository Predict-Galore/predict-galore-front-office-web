/**
 * 404 NOT FOUND PAGE
 * Server Component so it can be statically prerendered without client context.
 */
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <span
          style={{
            fontSize: 'clamp(4rem, 12vw, 12rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #36b15e 0%, #ec4751 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}
        >
          404
        </span>
      </div>

      <h1
        style={{
          fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
          fontWeight: 700,
          color: '#393941',
          marginBottom: '1rem',
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          color: '#5d5e6c',
          maxWidth: '28rem',
          marginBottom: '2rem',
          lineHeight: 1.75,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL
        or navigate back to the homepage.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#36b15e',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '12px',
            textDecoration: 'none',
          }}
        >
          Back to Home
        </Link>
        <Link
          href="/landing-page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: '2px solid #d9d9de',
            color: '#393941',
            fontWeight: 600,
            borderRadius: '12px',
            textDecoration: 'none',
          }}
        >
          Go to Landing
        </Link>
      </div>

      <p style={{ color: '#5d5e6c', fontSize: '0.875rem', marginTop: '1rem' }}>
        Need help?{' '}
        <Link href="/contact-us" style={{ color: '#36b15e', textDecoration: 'none' }}>
          Contact support
        </Link>
      </p>
    </div>
  );
}
