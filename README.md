# CDK CloudWatch Metrics:

## Reference: 

### Amazon EBS metrics: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide//using_cloudwatch_ebs.html

### How to Calculate Your EBS Volume IOPS on CloudWatch: https://onica.com/blog/managed-services/calculate-aws-ebs-volume-iops/

### How does Amazon EBS calculate the optimal I/O size I should use to improve performance on my gp2 or io1 volume?: https://aws.amazon.com/premiumsupport/knowledge-center/ebs-calculate-optimal-io-size/;

### IOPS: IOPS is an acronym for “input/output operations per second” and is a popular performance metric used to distinguish one storage type from another. Similar to device makers, AWS associates IOPS values to the volume component backing the storage option. Provisioned IOPS are an AWS EBS volume type designed to deliver predictable, high-level performance for I/O intensive workloads such as database applications. 

#### IOPS Usage = (Total Read OPerations + Write Operations) / Time (in Seconds)

#### Throughput in Mbs = '(Total Read Throughput bytes + Total Read Throughput bytes)/60/1024/1024'  

## 1 Install:  
### git clone https://github.com/vaughngit/aws-ts-cloudwatch-dashboard.git
### cd aws-ts-cloudwatch-dashboard/
### npm install 

## 2 Deploy: 
###    Update Variables in: /bin/cdk-app-stack-deploy.ts

### cdk deploy 

## 3 Delete:
###    cdk destroy 



