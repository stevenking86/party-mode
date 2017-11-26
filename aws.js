// Set the region where your identity pool exists (us-east-1, eu-west-1)
AWS.config.region = "us-east-1";

// Configure the credentials provider to use your identity pool
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:8231458e-045a-4d6f-8c40-00608ed25a42"
});

// old id pool id: us-east-1:8231458e-045a-4d6f-8c40-00608ed25a42
// arn arn:aws:iam::990418011469:role/Cognito_PartyModeUnauth_Role

// Make the call to obtain credentials
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

function getS3Files() {
  var params = {
    Bucket: 'party-mode',
    Prefix: '2017/11'
  }

  var s3 = new AWS.S3();

  var data = {}

  s3.listObjects(params, function (err, data) {
    if(err)throw err;

    var keys = data.Contents.map(function(content) {
      return content.Key;
    });

    keys.map(function(key) {
      var params = {
        Bucket: 'party-mode',
        Key: key
      }

      s3.getObject(params, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          var splitString = data.Body.toString().split('}')
          splitString.map(function(obj) {
            allData.push(JSON.parse(obj + '}'))
          })
        }
      });
    })
  });
}

// Access to S3 buckets: Had to change permissions on S3 bucket itself to allow CORS
// Had to give access to my cognito user to access individual objects in bucket AND bucket itself.

