---
title: "AWS Silentshell: Day 1 - Setup"
date: "2026-10-03"
excerpt: "Day one of creating my portfolio site."
---


### Creating Account
 - MFA 
	 - FIDO2 Security key - dedicated USB/hardware device used to prove identity
	 - Hardware TOTP key - an offline device setup using the private key from the service to provide a code that is not transmitted online but proves ownership of the private key
- Account Creation
	- Root user - best used for management through the AWS management console, create IAM users for more permanent use for daily tasks and IAM roles for temporary credentials
	- Created an IAM user for terminal use to interact with AWS. Began with no privileges, and will add them as necessary.
		Added first permission: 
- Terminal Setup
	- Used AWS documentation to install the AWS CLI. Logged in with IAM user.

### S3
- Object storage service - Will be used to store the compiled React build output (HTML, CSS, JS, assets). Will be private and only accessible to the Amazon CloudFront service
Created S3 Bucket, default configurations.

### CloudFront
- A CDN (content delivery network - net of proxy servers across regions for faster service) handling caching.
Managed settings for the content, such as setting the default root to index.html, and creating custom error response messages for 403 and 404, redirecting to the root object.

### GitHub Actions

Creating IAM user for GitHub actions
- Policy setup from JSON 
```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<your-account-id>:distribution/<your-distribution-id>"
    }
  ]
}
```

- The distribution id is the CloudFront identifier for the specific CDN config
- Created a new IAM user and assigned the policy.
- In order to allow interaction between Git and S3, created an access key for the IAM user, and stored them as Repo secrets in Actions.

![Screenshot of AWS secrets](/blog-images/AWS_REPO_SECRETS.png)