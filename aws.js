// Set the region where your identity pool exists (us-east-1, eu-west-1)
AWS.config.region = "us-east-1";

// Configure the credentials provider to use your identity pool
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:8231458e-045a-4d6f-8c40-00608ed25a42"
});

AWS.config.credentials.get(function () {
    console.log("Credentials updated");
    // Credentials will be available when this function is called.
});


function sendKinesisData(vals) {
    var firehose, firehoseParams;

    firehoseParams = {
        "DeliveryStreamName": "party-hose",
        "Record": {
            "Data": JSON.stringify(vals)
        }
    };

    firehose = new AWS.Firehose({
        apiVersion: "2015-08-04",
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        region: "us-east-1"

    });

    firehose.putRecord(firehoseParams, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        // else     console.log(data);           // successful response
    });
}

function getS3Files(callback) {
  var params = {
    Bucket: 'party-mode',
    Prefix: '2017/11'
  }

  var s3 = new AWS.S3();

  var data = {}

  s3.listObjects(params, function (err, data) {
    if(err)throw err;

    soundData = []
    var counter = 0
    var finalNum = data.Contents.length

    data.Contents.forEach(function(content) {
      var params = {
        Bucket: 'party-mode',
        Key: content.Key
      }

      s3.getObject(params, function (err, data) {
        counter += 1;
        if (err) {
          console.log(err);
        } else {
          var splitString = data.Body.toString().split('}')


          splitString.slice(0, splitString.length-1).forEach(function(obj) {
              soundData.push(JSON.parse(obj + '}'))
          })
        }

        checkDone(counter, finalNum, callback, soundData);
      });
    })
  });
}

function checkDone(counter, finalNum, callback, soundData) {
  if (counter === finalNum) {
    callback(soundData)
  }
}

// Access to S3 buckets: Had to change permissions on S3 bucket itself to allow CORS
// Had to give access to my cognito user to access individual objects in bucket AND bucket itself.

