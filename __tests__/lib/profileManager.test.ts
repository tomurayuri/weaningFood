import {
  saveProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  validateProfile,
  getAgeInfo
} from '@/lib/profileManager';
import { BabyProfile } from '@/types';

describe('プロフィール管理ロジック', () => {
  const validProfile: BabyProfile = {
    id: 'test-id-123',
    name: 'たろうくん',
    birthDate: '2024-02-16',
    createdAt: '2024-08-16T00:00:00.000Z',
    updatedAt: '2024-08-16T00:00:00.000Z'
  };

  // テスト前にlocalStorageをクリア
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveProfile 関数', () => {
    test('新しいプロフィールを正常に保存できる', () => {
      const newProfile = {
        name: 'はなちゃん',
        birthDate: '2024-01-15'
      };

      const savedProfile = saveProfile(newProfile);

      expect(savedProfile).toHaveProperty('id');
      expect(savedProfile).toHaveProperty('createdAt');
      expect(savedProfile).toHaveProperty('updatedAt');
      expect(savedProfile.name).toBe('はなちゃん');
      expect(savedProfile.birthDate).toBe('2024-01-15');
      expect(typeof savedProfile.id).toBe('string');
      expect(savedProfile.id.length).toBeGreaterThan(0);
    });

    test('IDが指定された場合はそのIDでプロフィールを保存', () => {
      const profileWithId = {
        id: 'custom-id-456',
        name: 'みゆちゃん',
        birthDate: '2024-03-20'
      };

      const savedProfile = saveProfile(profileWithId);

      expect(savedProfile.id).toBe('custom-id-456');
      expect(savedProfile.name).toBe('みゆちゃん');
    });

    test('localStorageに正しく保存される', () => {
      const profile = {
        name: 'ゆうくん',
        birthDate: '2024-05-10'
      };

      const savedProfile = saveProfile(profile);
      const storedData = localStorage.getItem('babyProfile');
      
      expect(storedData).not.toBeNull();
      const parsedData = JSON.parse(storedData!);
      expect(parsedData.id).toBe(savedProfile.id);
      expect(parsedData.name).toBe('ゆうくん');
    });
  });

  describe('getProfile 関数', () => {
    test('保存されたプロフィールを正常に取得できる', () => {
      // 事前にプロフィールを保存
      const savedProfile = saveProfile({
        name: 'あいちゃん',
        birthDate: '2024-04-05'
      });

      const retrievedProfile = getProfile();

      expect(retrievedProfile).not.toBeNull();
      expect(retrievedProfile?.id).toBe(savedProfile.id);
      expect(retrievedProfile?.name).toBe('あいちゃん');
      expect(retrievedProfile?.birthDate).toBe('2024-04-05');
    });

    test('プロフィールが存在しない場合はnullを返す', () => {
      const profile = getProfile();
      expect(profile).toBeNull();
    });

    test('不正なJSONデータの場合はnullを返す', () => {
      localStorage.setItem('babyProfile', '不正なJSON');
      const profile = getProfile();
      expect(profile).toBeNull();
    });
  });

  describe('updateProfile 関数', () => {
    test('既存プロフィールを正常に更新できる', () => {
      // 事前にプロフィールを保存
      const originalProfile = saveProfile({
        name: 'けんくん',
        birthDate: '2024-06-15'
      });

      // 更新前の時刻を記録
      const beforeUpdate = new Date().toISOString();

      // 少し待機してタイムスタンプが確実に変わるようにする
      const updates = {
        name: 'けんくん（更新後）',
        birthDate: '2024-06-20'
      };

      const updatedProfile = updateProfile(updates);

      expect(updatedProfile).not.toBeNull();
      expect(updatedProfile?.id).toBe(originalProfile.id);
      expect(updatedProfile?.name).toBe('けんくん（更新後）');
      expect(updatedProfile?.birthDate).toBe('2024-06-20');
      expect(updatedProfile?.createdAt).toBe(originalProfile.createdAt);
      expect(updatedProfile?.updatedAt).not.toBe(originalProfile.updatedAt);
      expect(new Date(updatedProfile?.updatedAt || '').getTime()).toBeGreaterThanOrEqual(new Date(beforeUpdate).getTime());
    });

    test('プロフィールが存在しない場合はnullを返す', () => {
      const updatedProfile = updateProfile({ name: '存在しない' });
      expect(updatedProfile).toBeNull();
    });
  });

  describe('deleteProfile 関数', () => {
    test('プロフィールを正常に削除できる', () => {
      // 事前にプロフィールを保存
      saveProfile({
        name: 'さくらちゃん',
        birthDate: '2024-07-25'
      });

      const result = deleteProfile();
      expect(result).toBe(true);

      // 削除後は取得できないことを確認
      const profile = getProfile();
      expect(profile).toBeNull();
    });

    test('プロフィールが存在しない場合もtrueを返す', () => {
      const result = deleteProfile();
      expect(result).toBe(true);
    });
  });

  describe('validateProfile 関数', () => {
    test('有効なプロフィールデータの場合はtrueを返す', () => {
      // 過去の日付を使用してテスト
      const validData = {
        name: 'りおちゃん',
        birthDate: '2024-01-01'
      };

      const result = validateProfile(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('名前が空の場合はバリデーションエラー', () => {
      const invalidData = {
        name: '',
        birthDate: '2024-08-01'
      };

      const result = validateProfile(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('名前は必須です');
    });

    test('名前が長すぎる場合はバリデーションエラー', () => {
      const invalidData = {
        name: 'あ'.repeat(51), // 51文字
        birthDate: '2024-08-01'
      };

      const result = validateProfile(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('名前は50文字以内で入力してください');
    });

    test('誕生日が不正な形式の場合はバリデーションエラー', () => {
      const invalidData = {
        name: 'ももちゃん',
        birthDate: '2024/08/01' // 不正な形式
      };

      const result = validateProfile(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('誕生日はYYYY-MM-DD形式で入力してください');
    });

    test('誕生日が未来日の場合はバリデーションエラー', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const invalidData = {
        name: 'みらいちゃん',
        birthDate: futureDate.toISOString().split('T')[0]
      };

      const result = validateProfile(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('誕生日は今日以前の日付を入力してください');
    });
  });

  describe('getAgeInfo 関数', () => {
    test('月齢と離乳食段階を正しく計算する（6ヶ月の場合）', () => {
      // 6ヶ月前の日付を設定
      const mockDate = new Date('2024-08-16');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const profile: BabyProfile = {
        id: 'test',
        name: 'テストちゃん',
        birthDate: '2024-02-16',
        createdAt: '2024-08-16T00:00:00.000Z'
      };

      const ageInfo = getAgeInfo(profile);

      expect(ageInfo.ageMonths).toBe(6);
      expect(ageInfo.stage).toBe('初期');
      expect(ageInfo.stageDescription).toBe('離乳食初期（5-6ヶ月）');
      expect(ageInfo.mealsPerDay).toBe(1);

      jest.useRealTimers();
    });

    test('月齢と離乳食段階を正しく計算する（8ヶ月の場合）', () => {
      const mockDate = new Date('2024-08-16');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const profile: BabyProfile = {
        id: 'test',
        name: 'テストくん',
        birthDate: '2023-12-16',
        createdAt: '2024-08-16T00:00:00.000Z'
      };

      const ageInfo = getAgeInfo(profile);

      expect(ageInfo.ageMonths).toBe(8);
      expect(ageInfo.stage).toBe('中期');
      expect(ageInfo.stageDescription).toBe('離乳食中期（7-8ヶ月）');
      expect(ageInfo.mealsPerDay).toBe(2);

      jest.useRealTimers();
    });

    test('離乳食開始前（4ヶ月）の場合', () => {
      const mockDate = new Date('2024-08-16');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const profile: BabyProfile = {
        id: 'test',
        name: 'あかちゃん',
        birthDate: '2024-04-16', // 正確に4ヶ月前の日付に修正
        createdAt: '2024-08-16T00:00:00.000Z'
      };

      const ageInfo = getAgeInfo(profile);

      expect(ageInfo.ageMonths).toBe(4);
      expect(ageInfo.stage).toBe('離乳食前');
      expect(ageInfo.stageDescription).toBe('離乳食開始前（5ヶ月未満）');
      expect(ageInfo.mealsPerDay).toBe(0);

      jest.useRealTimers();
    });
  });
});