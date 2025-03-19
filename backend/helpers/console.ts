import chalk from 'chalk';

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
  private logWithTimestamp(message: string): void {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString();
    const localHour = currentDate.toLocaleTimeString();
    console.log(
      `${chalk.gray(localDate)} ${chalk.gray(localHour)} ${chalk.gray('⤷')} ${this.getCallerDetails()} ${chalk.yellowBright(this.moduleName)} ${chalk.gray('→')} ${chalk.whiteBright(message)}`
    );
  }

  // Éxito
  public success(message: string, showCallerDetails: boolean = true): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp(`${chalk.greenBright('⣿ SUCCESS ✔ ⣿')} ${message}`);
  }

  // Información
  public info(message: string, showCallerDetails: boolean = true): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp(`${chalk.blueBright('⣿ INFO 🛈 ⣿')} ${message}`);
  }

  // Advertencia
  public warn(message: string, showCallerDetails: boolean = true): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp(`${chalk.yellowBright('⣿ WARNING ⚠ ⣿')} ${message}`);
  }

  // Error
  public error(message: string, showCallerDetails: boolean = true): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp(`${chalk.redBright('⣿ ERROR ✘ ⣿')} ${message}`);
  }

  // Debug
  public debug(message: string, showCallerDetails: boolean = true): void {
    this.showCallerDetails = showCallerDetails;
    this.logWithTimestamp(`${chalk.magentaBright('⣿ DEBUG 🛠  ⣿')} ${message}`);
  }
}

export default Console;
