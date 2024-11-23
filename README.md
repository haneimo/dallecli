# 超概要
Bing Image Creatorでは商用利用できないため、DALL-E3に直接プロンプトを指示するためのコマンドを作成。

# 手順

## 1. セットアップ
```
git clone dallecli
cd dallecli
npm install
```

## 2. OpenAI API作成
https://platform.openai.com/settings/
プロジェクトの設定のなかで「APIKeys」メニューから作成可能

## 3. APIキーの認識
```
export OPENAI_API_KEY=[取得したAPIキーを入力]
```

## 4. クレジットの追加
以下ページより追加可能。

https://platform.openai.com/settings/organization/billing/overview

最小は$5(現：773.87 円)から追加可能。もしのこっているのであれば追加不要。

## 5. 実行
```
node dalleCLI.js "ダブルクオートで囲んだ中にプロンプトを入力"
```

## 6. 確認

- imagesディレクトリが作成され、生成された画像がダウンロードされる
- logディレクトリにyyyymm.log形式で月ごとのログが出力される

# 他：従量課金で死なないために

私は以下のことをしてます。参考までに。

- [Billing](https://platform.openai.com/settings/organization/billing/overview)のページをコマンド利用後にチェックする
- APIKeyは都度生成、使い終わったら[OpenAIのページ](https://platform.openai.com/settings/)で都度DELETEする
- `unset OPENAI_API_KEY`でAPIキーを環境から削除