import 'dotenv/config';

interface EnvPromps {
    TIMEZONE: string;
    PORT: string;
    APP_NAME: string;
    TOKEN_SECRET: string;

    HOST: string;
    DIALECT: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql";
    DB_NAME: string;
    DB_USER: string;
    DB_PASSW: string;

    EMAIL_SERVICE: string;
    EMAIL_USER: string;
    EMAIL_PASSWD: string;
    EMAIL_SEND: string;

    SSL_KEY: string;
    SSL_CERT: string;

    TIME_RESET_PASSWD: string;
    TIME_SESION: string;
    LIMIT_FILE: string;
    SHOW_APIS: string;
    SHOW_COMMANDS: string;
    PRODUCTION: string;
}

export const {
    TIMEZONE,
    PORT,
    APP_NAME,
    TOKEN_SECRET,

    HOST,
    DIALECT,
    DB_NAME,
    DB_USER,
    DB_PASSW,

    EMAIL_SERVICE,
    EMAIL_USER,
    EMAIL_PASSWD,
    EMAIL_SEND,

    SSL_KEY,
    SSL_CERT,

    TIME_RESET_PASSWD,
    TIME_SESION,
    LIMIT_FILE,
    SHOW_APIS,
    SHOW_COMMANDS,
    PRODUCTION,
} = process.env as unknown as EnvPromps;
