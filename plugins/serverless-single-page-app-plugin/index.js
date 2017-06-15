'use strict'

const spawnSync = require('child_process').spawnSync

class ServerlessPlugin {
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options
    this.commands = {
      syncToS3: {
        usage: 'Deploys the `app` directory to your bucket',
        lifecycleEvents: [
          'sync'
        ]
      },
      domainInfo: {
        usage: 'Fetches and prints out the deployed CloudFront domain names',
        lifecycleEvents: [
          'domainInfo'
        ]
      }
    }

    this.hooks = {
      'after:deploy:deploy': this.syncDirectory.bind(this),
      'syncToS3:sync': this.syncDirectory.bind(this),
      'domainInfo:domainInfo': this.domainInfo.bind(this)
    }
  }

  // syncs the `app` directory to the provided bucket
  syncDirectory () {
    this.options.profile = this.options.profile || this.serverless.variables.service.provider.profile
    this.options.region = this.options.region || this.serverless.variables.service.provider.region

    const s3Bucket = this.serverless.variables.service.custom.s3Bucket
    const args = [
      '--profile',
      this.options.profile,
      '--region',
      this.options.region,
      's3',
      'sync',
      'app/',
      `s3://${s3Bucket}/`
    ]

    const result = spawnSync('aws', args)
    const stdout = result.stdout.toString()
    const sterr = result.stderr.toString()
    if (stdout) {
      this.serverless.cli.log(stdout)
    }
    if (sterr) {
      this.serverless.cli.log(sterr)
    }
    if (!sterr) {
      this.serverless.cli.log('Successfully synced to the S3 bucket')
    }
  }

  // fetches the domain name from the CloudFront outputs and prints it out
  domainInfo () {
    const provider = this.serverless.getProvider('aws')
    const stackName = provider.naming.getStackName(this.options.stage)
    return provider
      .request(
        'CloudFormation',
        'describeStacks',
        { StackName: stackName },
        this.options.stage,
        this.options.region // eslint-disable-line comma-dangle
      )
      .then((result) => {
        const outputs = result.Stacks[0].Outputs
        const output = outputs.find(entry => entry.OutputKey === 'WebAppCloudFrontDistributionOutput')
        if (output.OutputValue) {
          this.serverless.cli.log(`Web App Domain: ${output.OutputValue}`)
        } else {
          this.serverless.cli.log('Web App Domain: Not Found')
        }
      })
  }
}

module.exports = ServerlessPlugin
