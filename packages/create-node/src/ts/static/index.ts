export const hello = (who: string): string => `Hello, ${who}!`;

export const writeHello = (who: string): void => console.log(hello(who));
