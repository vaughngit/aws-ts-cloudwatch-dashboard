import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Duration, Stack, StackProps, CfnOutput, Aws } from "aws-cdk-lib";
import { GraphWidget, Dashboard, LogQueryWidget, TextWidget, Metric, Dimension,   MathExpression, GraphWidgetView} from 'aws-cdk-lib/aws-cloudwatch';
import {aws_ssm as ssm } from 'aws-cdk-lib' 
import { Construct } from 'constructs';
import { CfnDimension } from 'aws-cdk-lib/aws-iot';
import { cwd } from 'process';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface IStackProps extends StackProps {
  solutionName: string;
  serviceName: string;  
  environment: string; 
  costcenter: string; 
  dashboardName: string; 
  VolumeId: string; 
}


export class AwsTsCloudwatchDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IStackProps) {
    super(scope, id, props);
   
    //Volume Metrics
    // Measure Reads: 
    const volumeReadOpsMetric = new Metric({
      metricName: "VolumeReadOps",
      namespace: "AWS/EBS",
      label: 'DemoVolumeReadOperations',
      dimensionsMap: {
        'VolumeId': props.VolumeId
      },
      statistic: 'Sum',
      period: Duration.minutes(1)
    })
    //Measure Writes: 
    const volumeWriteOpsMetric = new Metric({
      metricName: "VolumeWriteOps",
      namespace: "AWS/EBS",
      label: 'DemoVolumeWriteOperations',
      dimensionsMap: {
        'VolumeId': props.VolumeId
      },
      statistic: 'Sum',
      period: Duration.minutes(1)
    })

    //Calculate IOPS
    //Measure IOPS: ( EBSWriteOps + EBSReadOps) = EBSIOPS
    const volumeIopsMetric = new MathExpression({
      expression: '(readOps+writeOps)/60', 
      label: 'Volume IOPS', 
      usingMetrics: { readOps: volumeReadOpsMetric, writeOps: volumeWriteOpsMetric }, 
      period: Duration.minutes(1),
    });

    ////////////////////////////////////////////////////////////////////////////
    //Measure Throughput 
        // Measure Reads: 
        const volumeReadThroughputMetric = new Metric({
          metricName: "VolumeReadBytes",
          namespace: "AWS/EBS",
          label: 'DemoVolumeReadThroughput',
          dimensionsMap: {
            'VolumeId': props.VolumeId
          },
          statistic: 'Sum',
          period: Duration.minutes(1)
        })
        //Measure Writes: 
        const volumeWriteThroughputMetric = new Metric({
          metricName: "VolumeWriteBytes",
          namespace: "AWS/EBS",
          label: 'DemoVolumeWriteThroughput',
          dimensionsMap: {
            'VolumeId': props.VolumeId
          },
          statistic: 'Sum',
          period: Duration.minutes(1)
        })
    
        //Calculate Throughput 
        //Measure IOPS: ( EBSWriteOps + EBSReadOps) = EBSIOPS
        const volumeThroughputMetric = new MathExpression({
          expression: '(read+write)/60/1024/1024', //Return Total MBs
          label: 'Volume Throughput in MBs/Sec', 
          usingMetrics: { read: volumeReadThroughputMetric, write: volumeWriteThroughputMetric }, 
          period: Duration.minutes(1),
        });



    ///////////////////////////////////////////////////////////////////////////////

      // Create CloudWatch Dashboard
      const dashboard = new Dashboard(this, "DemoDashboard", {
        dashboardName: props.dashboardName, 
      })

      // Create Title for Dashboard
      dashboard.addWidgets(new TextWidget({
        markdown: `# Dashboard: Instance EBS Performance`,
        height: 1,
        width: 24
      }))

    dashboard.addWidgets(new GraphWidget({
      title: "Volume IOPS Per Minute",
      width: 24,
      left: [volumeIopsMetric], 
      liveData: true, 
      statistic: "Average",
      view: GraphWidgetView.TIME_SERIES,
      period: Duration.minutes(1)
    }))
    dashboard.addWidgets(new GraphWidget({
      title: "Volume Throughput Per Minute",
      width: 24,
      left: [volumeThroughputMetric], 
      liveData: true, 
      statistic: "Average",
      view: GraphWidgetView.TIME_SERIES,
      period: Duration.minutes(1)
    }))




/*     dashboard.addWidgets(new GraphWidget({
      title: "VolumeReadOps",
      width: 24,
      left: [volumeReadOpsMetric], 
      liveData: true, 
    }))
    dashboard.addWidgets(new GraphWidget({
      title: "VolumeWriteOps",
      width: 24,
      left: [volumeWriteOpsMetric], 
      liveData: true, 
    }))
    
 */

        // Generate Outputs
        const cloudwatchDashboardURL = `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}}#dashboards:name=${props.dashboardName}`;
        new CfnOutput(this, 'DashboardOutput', {
          value: cloudwatchDashboardURL,
          description: 'URL of Demo CloudWatch Dashboard',
          exportName: 'DemoCloudWatchDashboardURL'
        });
  }
}
