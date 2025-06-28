const express = require('express');
const Url = require('../models/Url');
const generateShortcode = require('../utils/generateShortCode');
const loggerMiddleware = require('../../Logger Middleware/loggerMiddleware');

const router = express.Router();

// POST /shorturls – creating short URL and maintaining uniqueness
router.post('/shorturls', async (req, res) => {
  try {
    const { url, shortcode, validity } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const code = shortcode || generateShortcode();
    const expiresAt = new Date(Date.now() + (validity || 30) * 60 * 1000);

    const existing = await Url.findOne({ shortcode: code });
    if (existing) {
      await loggerMiddleware({
        body: {
          stack: "backend",
          level: "error",
          package: "route",
          message: `Shortcode "${code}" already exists`,
        }
      }, {}, () => {});
      return res.status(409).json({ message: 'Shortcode already in use' });
    }

    const newUrl = new Url({
      url,
      shortcode: code,
      expiresAt,
    });

    await newUrl.save();

    await loggerMiddleware({
      body: {
        stack: "backend",
        level: "info",
        package: "route",
        message: `Short URL created for "${url}" with shortcode "${code}"`,
      }
    }, {}, () => {});

    return res.status(201).json({ message: 'Short URL created', shortcode: code });

  } catch (err) {
    console.error('Error creating short URL:', err);
    await loggerMiddleware({
      body: {
        stack: "backend",
        level: "error",
        package: "route",
        message: err.message,
      }
    }, {}, () => {});
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /shorturls/:shortcode – redirect and track
router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortcode });

    if (!urlEntry) {
      await loggerMiddleware({
        body: {
          stack: "backend",
          level: "error",
          package: "route",
          message: `Shortcode "${shortcode}" not found`,
        }
      }, {}, () => {});
      return res.status(404).json({ message: 'Shortcode not found' });
    }

    if (new Date() > urlEntry.expiresAt) {
      await loggerMiddleware({
        body: {
          stack: "backend",
          level: "warn",
          package: "route",
          message: `Shortcode "${shortcode}" has expired`,
        }
      }, {}, () => {});
      return res.status(410).json({ message: 'Short URL has expired' });
    }

    const referrer = req.get('referer') || 'Direct';
    const location = 'Unknown';

    urlEntry.clicks += 1;
    urlEntry.clickDetails.push({
      timestamp: new Date(),
      referrer,
      location,
    });

    await urlEntry.save();

    await loggerMiddleware({
      body: {
        stack: "backend",
        level: "info",
        package: "route",
        message: `Redirected shortcode "${shortcode}" to "${urlEntry.url}"`,
      }
    }, {}, () => {});

    return res.redirect(urlEntry.url);

  } catch (err) {
    console.error('Error during redirect:', err);
    await loggerMiddleware({
      body: {
        stack: "backend",
        level: "error",
        package: "route",
        message: err.message,
      }
    }, {}, () => {});
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/shorturls', async (req, res) => {
  try {
    const allUrls = await Url.find().sort({ createdAt: -1 });

    await loggerMiddleware({
      body: {
        stack: "backend",
        level: "info",
        package: "route",
        message: `Fetched all short URLs (${allUrls.length})`,
      }
    }, {}, () => {});

    res.json(allUrls);
  } catch (err) {
    console.error('Error fetching URLs:', err);
    await loggerMiddleware({
      body: {
        stack: "backend",
        level: "error",
        package: "route",
        message: err.message,
      }
    }, {}, () => {});
    res.status(500).json({ message: 'Failed to fetch URLs' });
  }
});

module.exports = router;
