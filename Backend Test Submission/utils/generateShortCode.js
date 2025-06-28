const { nanoid } = require('nanoid');

// This function generates a unique shortcode for a URL
// It uses nanoid to create a 6-character unique ID
const generateShortcode = () => {
  return nanoid(6); // only 6-character unique ID for generating shortcodes
};

module.exports = generateShortcode;
