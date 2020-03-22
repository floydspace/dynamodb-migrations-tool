import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';

import { migratorFactory } from '../src';

describe('Migrator tests', () => {
  beforeAll((done) => {
    AWSMock.setSDKInstance(AWS);
    done();
  });

  it('Should not migrator factory be thrown', async () => {
    const factory = () => migratorFactory();
    expect(factory).not.toThrow();
  });
});
