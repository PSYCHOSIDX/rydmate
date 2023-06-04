
  const client = require("twilio")(
    process.env.REACT_APP_ACCOUNT_SID,
    process.env.REACT_APP_AUTH_TOKEN,
  );

  export default async (req, res) => 
  {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    client.messages.create({
        from: process.env.REACT_APP_TWILIO_PH,
        to: req.body.to,
        body: req.body.body
      })
      .then(() => {
        res.send(JSON.stringify({ success: true }));
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
      });
  }