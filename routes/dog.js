var express = require('express');
var https = require('https');
var router = express.Router();

router.get('/', function(req, res) {
  var request = https.get(
    'https://dog.ceo/api/breeds/image/random',
    function(response) {
      var body = '';

      response.on('data', function(chunk) {
        body += chunk;
      });

      response.on('end', function() {
        if (response.statusCode !== 200) {
          return res.status(502).json({
            error: 'Dog APIから取得できませんでした'
          });
        }

        try {
          res.json(JSON.parse(body));
        } catch (error) {
          res.status(502).json({
            error: 'データを読み取れませんでした'
          });
        }
      });

      response.on('error', function() {
        if (!res.headersSent) {
          res.status(502).json({ error: '受信に失敗しました' });
        }
      });
    }
  );

  request.setTimeout(10000, function() {
    request.destroy();
  });

  request.on('error', function() {
    if (!res.headersSent) {
      res.status(502).json({ error: 'Dog APIに接続できませんでした' });
    }
  });
});

module.exports = router;