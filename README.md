# AWS Setup

### IAM
- Users > Create new > Name: `serverless` > Policy: `AdministratorAccess`

Store your credentials at: `~/.aws/credentials`

```
[development]
aws_access_key_id = ********
aws_secret_access_key = ********
```

https://console.aws.amazon.com/iam/home#/security_credential

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


#### Read it later
https://github.com/nfour/serverless-build-plugin
https://www.npmjs.com/package/serverless-webpack
https://github.com/laardee/serverless-authentication-boilerplate
https://www.npmjs.com/package/serverless-aws-models
https://www.npmjs.com/package/serverless-plugin-warmup
https://github.com/laardee/serverless-authentication-boilerplate/blob/master/authentication/serverless.yml
