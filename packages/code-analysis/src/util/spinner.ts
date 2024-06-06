// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// let ora: any;
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// let chalk: any;

// export type MessageFormatter = (message: string, chalk: any) => string;

// export class Spinner {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   protected chalk: any;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   protected ora: any;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   protected spinner: any;

//   public async start(
//     message: string,
//     formatter: MessageFormatter = (message, chalk) => chalk.gray(message),
//   ): Promise<Spinner> {
//     if (!chalk) {
//       this.chalk = (await import('chalk')).default;
//     }
//     if (!ora) {
//       this.ora = (await import('ora')).default;
//     }

//     this.spinner = this.ora(formatter(message, this.chalk)).start();

//     return this;
//   }

//   public update(message: string, formatter: MessageFormatter = (message, chalk) => chalk.gray(message)): Spinner {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     this.spinner.text = formatter(message, this.chalk);

//     return this;
//   }

//   public fail(message: string, formatter: MessageFormatter = (message, chalk) => chalk.red(message)): Spinner {
//     this.spinner.fail(formatter(message, this.chalk));

//     return this;
//   }

//   public succeed(message: string, formatter: MessageFormatter = (message, chalk) => chalk.green(message)): Spinner {
//     this.spinner.succeed(formatter(message, this.chalk));

//     return this;
//   }
// }

// export const createSpinner = async (message: string): Promise<Spinner> => {
//   return await new Spinner().start(message);
// };
