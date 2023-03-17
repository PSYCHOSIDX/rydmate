import Tesseract from 'tesseract.js';

const image = document.getElementById('image');

const config = {
  lang: 'eng',
  tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
};

Tesseract.recognize(image, config)
  .then(result => {
    console.log(result.text);
  })
  .catch(error => {
    console.error(error);
  });
