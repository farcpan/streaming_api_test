import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ContextParameters } from '../utils/context';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { AuthorizationType, Cors, EndpointType, LambdaIntegration, ResponseTransferMode, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';

interface SrcStackProps extends StackProps {
  context: ContextParameters
}

export class SrcStack extends Stack {
  constructor(scope: Construct, id: string, props: SrcStackProps) {
    super(scope, id, props);

    // LogGroup
    const logGroupForLambdaFn = new LogGroup(this, props.context.getResourceId("log-group"), {
      logGroupName: props.context.getResourceId("log-group"),
      retention: RetentionDays.ONE_DAY,
    })

    // Lambda
    const streamFunction = new NodejsFunction(this, props.context.getResourceId("stream-api-fn"), {
      runtime: Runtime.NODEJS_22_X,
      entry: join(__dirname, "../lambdas/index.ts"),
      handler: "streamApiHandler",
      timeout: Duration.minutes(2),
      logGroup: logGroupForLambdaFn,
      bundling: {
        target: "node22",
      }
    });

    // API Gateway
    const stageName = "api";
    const api = new RestApi(this, props.context.getResourceId("api"), {
      restApiName: props.context.getResourceId("api"),
      endpointTypes: [EndpointType.REGIONAL],
      deployOptions: {
        stageName: stageName,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        statusCode: 200,
        allowHeaders: Cors.DEFAULT_HEADERS,
      }
    });

    // Lambda Integration: Streaming option is required here.
    const streamLambdaIntegration = new LambdaIntegration(streamFunction, { responseTransferMode: ResponseTransferMode.STREAM });

    // Method
    const streamResource = api.root.addResource("stream");
    streamResource.addMethod("GET", streamLambdaIntegration, {
      authorizationType: AuthorizationType.NONE,
    });

		// API URL
		const registerApiUrlId: string = props.context.getResourceId('api-base-url');
		new CfnOutput(this, registerApiUrlId, {
			value: `https://${api.restApiId}.execute-api.${props.context.stageParameters.region}.amazonaws.com/${stageName}/`,
		});
  }
}
