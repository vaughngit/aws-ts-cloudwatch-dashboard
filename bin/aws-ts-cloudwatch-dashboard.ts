#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsTsCloudwatchDashboardStack } from '../lib/aws-ts-cloudwatch-dashboard-stack';

const aws_region = 'us-east-2'
const solutionName = "cloudwatch-monitoring"
const environment = "dev"
const costcenter = "12_1_12_9_20_8"

const app = new cdk.App();



new AwsTsCloudwatchDashboardStack(app, 'CWDashboard', {
  env: {
    region: aws_region || process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  stackName: 'CDK-Volume-Metric-Dashboard', 
  serviceName: "",
  VolumeId: "", 
  solutionName,
  environment,
  costcenter,
  dashboardName: "DemoDashboard"
});