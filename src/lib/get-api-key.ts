/**
 * 環境変数からAPIキーを取得する
 * 設定しない場合は例外を投げる
 */
export function getApiKey(): string {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // API キーが設定されていない場合はアプリケーションが成立しないので例外を投げる
    throw new Error("API key is not defined");
  }
  return apiKey;
}
