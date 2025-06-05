declare namespace NodeJS {
  interface ProcessEnv {
    readonly SENDGRID_API_KEY: string;
    readonly SENDGRID_FROM_EMAIL: string;
    readonly NEXT_PUBLIC_APP_URL: string;
    readonly DATABASE_URL: string;
  }
}
