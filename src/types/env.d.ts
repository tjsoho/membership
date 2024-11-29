declare namespace NodeJS {
  interface ProcessEnv {
    SENDGRID_API_KEY: string
    SENDGRID_FROM_EMAIL: string
    NEXT_PUBLIC_APP_URL: string
    DATABASE_URL: string
    NEXTAUTH_SECRET: string
  }
} 