import AsyncStorage from '@react-native-community/async-storage';
import SettingModel from '../../../Features/Settings/Models/SettingModel';
import SettingsFeature from '../../../Features/Settings/SettingsFeature';

describe('Settings feature', () => {
  it('check if settings has async storage key', async (done) => {
    expect(SettingModel.getAsyncStorageKey()).not.toBeFalsy();

    done();
  });

  test('Settings init test', async (done) => {
    const instance = new SettingsFeature();
    expect(instance.isInitialized()).toBeFalsy();
    instance.init().then((result) => {
      expect(result).toBe(true);
      expect(instance.isInitialized()).toBeTruthy();

      done();
    });
  });

  it('check if settings are readable', async (done) => {
    SettingModel.load().then(() => {
      expect(AsyncStorage.getItem).toBeCalledWith(
        SettingModel.getAsyncStorageKey(),
      );
    });

    done();
  });

  it('check if settings were not existed', async () => {
    jest.setMock('@react-native-community/async-storage', {
      getItem: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve({});
          }),
      ),
    });

    const idealSettings = new SettingModel();

    SettingModel.load().then((response) => {
      expect(response.instance).toEqual(idealSettings);
      expect(response.instance.theme).toBe(null);
      expect(response.isEmptyModel).toBe(true);
    });
  });

  it('check if settings existed', async () => {
    const idealSettings = new SettingModel();
    idealSettings.theme = 'dark';
    jest.setMock('@react-native-community/async-storage', {
      getItem: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve({
              [SettingModel.getAsyncStorageKey() || '']: JSON.stringify(
                idealSettings,
              ),
            });
          }),
      ),
    });

    SettingModel.load().then((receivedSettings) => {
      expect(receivedSettings.instance).toEqual(idealSettings);
      expect(receivedSettings.instance).toBe('dark');
      expect(receivedSettings.isEmptyModel).toEqual(false);
    });
  });
});
