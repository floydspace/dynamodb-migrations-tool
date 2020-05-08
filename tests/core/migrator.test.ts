import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';

import { Migrator } from '../../src/core/migrator';

describe('Migrator tests', () => {
  beforeAll((done) => {
    AWSMock.setSDKInstance(AWS);
    done();
  });

  it('Should not migrator factory be thrown', async () => {
    const factory = () => new Migrator();
    expect(factory).not.toThrow();
  });
});
