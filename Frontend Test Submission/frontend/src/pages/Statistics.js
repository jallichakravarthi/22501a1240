import React, { useEffect, useState } from 'react';
import logEvent from '../utils/logger';
const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5051/shorturls');
        const data = await res.json();

        if (res.ok) {
          setUrls(data);
          await logEvent({
            level: 'info',
            message: 'Fetched URL statistics successfully',
            pkg: 'Statistics',
            stack: 'frontend',
          });
        } else {
          setError(data.message || 'Failed to fetch statistics.');
          await logEvent({
            level: 'error',
            message: `Stats fetch failed - ${data.message || 'Unknown error'}`,
            pkg: 'Statistics',
            stack: 'frontend',
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Server error occurred.');
        await logEvent({
          level: 'error',
          message: `Stats fetch exception - ${err.message}`,
          pkg: 'Statistics',
          stack: 'frontend',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>URL Shortener Statistics</h2>

      {loading && <p>Loading statistics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {urls.map((item, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 15 }}>
          <p><strong>Short URL:</strong> <a href={`http://localhost:5051/shorturls/${item.shortcode}`} target="_blank" rel="noopener noreferrer">{item.shortcode}</a></p>
          <p><strong>Original URL:</strong> {item.url}</p>
          <p><strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
          <p><strong>Expires At:</strong> {new Date(item.expiresAt).toLocaleString()}</p>
          <p><strong>Total Clicks:</strong> {item.clicks}</p>

          {item.clickTimestamps?.length > 0 && (
            <div>
              <p><strong>Click Timestamps:</strong></p>
              <ul>
                {item.clickTimestamps.map((ts, i) => (
                  <li key={i}>{new Date(ts).toLocaleString()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Statistics;
