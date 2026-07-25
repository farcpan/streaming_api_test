#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { SrcStack } from '../lib/src-stack';
import { ContextParameters } from '../utils/context';

const app = new cdk.App();
const context = new ContextParameters(app);

new SrcStack(app, context.getResourceId("src-stack"), {
  context: context,
});
