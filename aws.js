// Set the region where your identity pool exists (us-east-1, eu-west-1)
AWS.config.region = 'us-east-1';

// Configure the credentials provider to use your identity pool
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:8231458e-045a-4d6f-8c40-00608ed25a42'
});

//just found id pool id: us-east-1:3f6689c7-45c2-4e50-acc1-26b23e4dbd30

// old id pool id: us-east-1:8231458e-045a-4d6f-8c40-00608ed25a42
//arn arn:aws:iam::990418011469:role/Cognito_PartyModeUnauth_Role

// Make the call to obtain credentials
AWS.config.credentials.get(function(){
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
});


function sendKinesisData(vals) {

  var params = {
    "DeliveryStreamName": 'party-hose',
    "Record": {
      "Data": JSON.stringify(vals)
    }
  };


  var firehose = new AWS.Firehose({
    apiVersion: '2015-08-04',
    accessKeyId: AWS.config.credentials.accessKeyId,
    secretAccessKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: 'us-east-1'

  });

  firehose.putRecord(params, function (err, data) {
    // if (err) console.log(err, err.stack); // an error occurred
    // else     console.log(data);           // successful response
  });
}
