# Facebook setup
https://developers.facebook.com/apps/387706484915786/settings/


### List of headers to enable on API Gateway
Default: 
'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,
Access-Control-Allow-Origin,Origin,Content-Range,Content-Description,Content-Disposition,x-requested-with,X-ACCESS_TOKEN'

# AWS Setup

### IAM

- Dashboard > Security Status > Setup all listed items
- Users > Create new > Name: `serverless` > Policy: `AdministratorAccess`

---
Copy your credentials from:
https://console.aws.amazon.com/iam/home#/security_credential

Store your credentials at: `~/.aws/credentials`
```
[development]
aws_access_key_id = ********
aws_secret_access_key = ********
```

---

# Setup

Replace the bucket name in `serverless.yaml` which you can find inside the custom section. This is due the fact that bucket names must be globally unique across all AWS S3 buckets.

Since this project uses a custom Serverless plugin you need to setup the `node_modules` by running:

```
npm install
```

For a fresh install, use this:

```
rm -rf node_modules && yarn cache clean && yarn install
```

The serverless-single-page-app-plugin plugin in this example is there to simplify the experience using this example. It's not necessary to understand the plugin to deploy your Single Page Application.

---

From non on, you can use `sls` to reference to the `serverless` command.

---

# Deploy

Give permission to execute the file `deploy.sh`:

```
chmod u+x deploy.sh
```



In order to deploy the Single Page Application you need to setup the infrastructure first by running

```
SLS_DEBUG=* serverless deploy -v

OR

./deploy
```

After this step your S3 bucket and CloudFront distribution is setup. Now you need to upload your static file e.g. `index.html` and `app.js` to S3. You can do this by running

```
serverless syncToS3
```

*Hint:* The plugin is simply running the AWS CLI command: `aws S3 sync app/ s3://yourBucketName123/`

Now you just need to figure out the deployed URL. You can use the AWS Console UI or run

```
serverless domainInfo
```

The expected result should be similar to

```
Serverless: Web App Domain: dyj5gf0t6nqke.cloudfront.net
```

### Deploy the Function

Use this to quickly upload and overwrite your function code, allowing you to develop faster.

```
serverless deploy function -f hello
```

#### Invoke the Function

Invokes an Function and returns logs.

```
serverless invoke -f hello -l
```

---

# Cleanup

If at any point, you no longer need your service, you can run the following command to remove the Functions, Events and Resources that were created, and ensure that you don't incur any unexpected charges.

```
serverless remove
```

---
### Notes

```
To use a federated identity, you set the API Gateway method to use “AWS_IAM” authorization. You use Cognito to create a role and associate it with your Cognito identity pool. You then use the Identity and Access Management (IAM) service to grant this role permission to call your API Gateway method.
```

The IAM credentials can then be used to sign the request to API Gateway via the API Gateways SDK generated earlier. NOTE: The session token also needs to be passed in via the x-amz-security-token header and the API key as x-api-key.

Finally, signing out is called on the user to end the session for the client app. There is also a globalSignOut function which will invalidated all the current tokens, effectively signing out of all client apps.

---

#### References

https://github.com/serverless/examples/tree/master/aws-node-single-page-app-via-cloudfront

DynamoDB
https://github.com/awslabs/aws-serverless-crud-sample/blob/master/movies-dynamodb.js


AWS Cognito ARN
http://docs.aws.amazon.com/cognito/latest/developerguide/resource-permissions.html

AWS ARN's
http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html


AWS Cognito + Facebook Login JavaScript Example
https://gist.github.com/brianberlin/443c3bd005ff63282394

Set Cognito Identity Roles Syntax
http://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_SetIdentityPoolRoles.html

CORS errors
https://forums.aws.amazon.com/thread.jspa?threadID=213844

#### Read it later
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html

https://www.npmjs.com/package/serverless-plugin-warmup
https://github.com/nfour/serverless-build-plugin
https://www.npmjs.com/package/serverless-webpack

https://github.com/laardee/serverless-authentication-boilerplate
https://www.npmjs.com/package/serverless-aws-models

https://github.com/laardee/serverless-authentication-boilerplate/blob/master/authentication/serverless.yml

https://dzone.com/articles/building-serverless-apps-with-aws-lambda
https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api

https://github.com/awslabs/aws-cognito-apigw-angular-auth/blob/master/sam/sam.yaml

https://github.com/keboola/developer-portal/blob/master/serverless.yml

https://github.com/chnbohwr/serverless_nodejs_rds/blob/master/serverless.yml

---

### ERRORS
Some errors are well known and here is the workaround:

```
The specified bucket does not exist
```
Login to `console.aws.amazon.com/cloudformation` and manually delete the *Stack* before a fresh deploy.

---
