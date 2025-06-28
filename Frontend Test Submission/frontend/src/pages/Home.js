import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logEvent from '../utils/logger'; // Import logger

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState('');
  const [message, setMessage] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShortUrl('');
    setCopied(false);

    if (!url) {
      setMessage('Please enter a URL.');
      await logEvent({
        level: 'warn',
        message: 'Attempted to shorten without providing a URL',
        pkg: 'Home',
        stack: 'frontend',
      });
      return;
    }

    const body = {
      url,
      ...(shortcode && { shortcode }),
      ...(validity && { validity: parseInt(validity) }),
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5051/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        const finalShortUrl = `http://localhost:5051/shorturls/${data.shortcode}`;
        setShortUrl(finalShortUrl);
        setMessage(data.message);
        setUrl('');
        setShortcode('');
        setValidity('');

        await logEvent({
          level: 'info',
          message: `Short URL created successfully: ${finalShortUrl}`,
          pkg: 'Home',
          stack: 'frontend',
        });
      } else {
        setMessage(data.message || 'Something went wrong.');
        await logEvent({
          level: 'error',
          message: `Short URL creation failed: ${data.message || 'Unknown error'}`,
          pkg: 'Home',
          stack: 'frontend',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Failed to connect to server.');
      await logEvent({
        level: 'error',
        message: `Request failed - ${err.message}`,
        pkg: 'Home',
        stack: 'frontend',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);

    logEvent({
      level: 'info',
      message: `Short URL copied to clipboard: ${shortUrl}`,
      pkg: 'Home',
      stack: 'frontend',
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Validity in minutes (optional)"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Generate Short URL'}
        </button>
      </form>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}

      {shortUrl && (
        <div style={{ marginTop: 20 }}>
          <p>
            Short URL:{' '}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </p>
          <button onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}
      <Link to="/stats">View Stats</Link>
    </div>
  );
};

export default Home;
