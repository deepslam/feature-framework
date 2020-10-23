// import { Store } from '@reduxjs/toolkit';
import TestApp from '../TestData/Application/TestApplication';

describe('Redux test', () => {
  it('Should be initialized correctly', async (done) => {
    const app = new TestApp({ version: '3.4.3' });

    try {
      app.init().then((result) => {
        expect(result).toBeTruthy();
        // expect(app.store!).toBeInstanceOf(Store);

        done();
      });
    } catch (e) {
      done(e);
    }
  });
});
