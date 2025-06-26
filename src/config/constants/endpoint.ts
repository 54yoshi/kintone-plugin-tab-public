/** REST API のエンドポイント（一部はプレビュー環境用） */
export const KINTONE_REST = {
  /** 本番環境のフォームレイアウト定義を取得 */
  GET_FORM_LAYOUT: '/k/v1/app/form/layout.json',

  /** 本番環境のフォームフィールド定義を取得 */
  GET_FORM_FIELDS: '/k/v1/app/form/fields.json',

  /** プレビュー環境のフォームレイアウト定義を取得（未デプロイ状態） */
  GET_FORM_LAYOUT_PREVIEW: '/k/v1/preview/app/form/layout.json',

  /** プレビュー環境のフォームフィールド定義を取得（未デプロイ状態） */
  GET_FORM_FIELDS_PREVIEW: '/k/v1/preview/app/form/fields.json',
} as const;

/** 固定URL（管理画面やプラグイン設定ページへのリンク） */
export const KINTONE_UI_URLS = {
  /** 管理画面：アプリ単位のプラグイン管理ページ（管理者向け） */
  ADMIN_APP_PLUGINS: '/k/admin/app',
  
  /** 管理画面：プラグインリストページへのパス */
  PLUGIN_LIST_PATH: '/plugin/',
} as const;
