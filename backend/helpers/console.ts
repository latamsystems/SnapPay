import chalk from 'chalk';

interface ConsoleProms {
  message: string;
  showCallerDetails?: boolean;
  dbs?: string[]
}


class Console {
  private readonly moduleName: string;
  private showCallerDetails: boolean;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.showCallerDetails = true;
  }

  // Obtener detalles del origen de la llamada
  private getCallerDetails(): string {
    if (!this.showCallerDetails) return '';

    const stack = new Error().stack;
    if (!stack) return chalk.italic(chalk.gray('Unknown:0'));

    const stackLines = stack.split('\n');

    for (let i = 2; i < stackLines.length; i++) {
      const line = stackLines[i].trim();

      // Filtrar llamadas internas del logger
      if (!line.includes('Console.') && !line.includes('node_modules')) {
        // Expresión regular mejorada para extraer archivo y línea
        const regex = /(?:\()?(?:.*[\\/])?([^\\/]+):(\d+):\d+(?:\))?/;
        const match = regex.exec(line);

        if (match) {
          const [, fileName, lineNumber] = match;
          return chalk.italic(
            chalk.gray(
              `${chalk.hex('#d7c79e')(fileName)}:${chalk.hex('#e0a70f')(lineNumber)}`
            )
          ) + ` ${chalk.gray('→')}`;
        }
      }
    }

    return chalk.italic(chalk.gray('Unknown:0'));
  }


  // Registrar con timestamp
  private logWithTimestamp({ message, dbs }: { message: string, dbs?: string[] }): void {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString();
    const localHour = currentDate.toLocaleTimeString();
    console.log(
      `${chalk.gray(localDate)} ${chalk.gray(localHour)} ${chalk.gray('⤷')} ${this.getCallerDetails()} ${chalk.yellowBright(this.moduleName)} ${chalk.gray('→')} ${chalk.whiteBright(message)}`
    );
  }

  // Éxito
  public success({ message, showCallerDetails = true, dbs }: ConsoleProms): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp({ message: `${chalk.greenBright('⣿ SUCCESS ✔ ⣿')} ${message}`, dbs });
  }

  // Información
  public info({ message, showCallerDetails = true, dbs }: ConsoleProms): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp({ message: `${chalk.blueBright('⣿ INFO 🛈 ⣿')} ${message}`, dbs });
  }

  // Advertencia
  public warn({ message, showCallerDetails = true, dbs }: ConsoleProms): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp({ message: `${chalk.yellowBright('⣿ WARNING ⚠ ⣿')} ${message}`, dbs });
  }

  // Error
  public error({ message, showCallerDetails = true, dbs }: ConsoleProms): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp({ message: `${chalk.redBright('⣿ ERROR ✘ ⣿')} ${message}`, dbs });
  }

  // Debug
  public debug({ message, showCallerDetails = true, dbs }: ConsoleProms): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp({ message: `${chalk.magentaBright('⣿ DEBUG 🛠  ⣿')} ${message}`, dbs });
  }
}

export default Console;
