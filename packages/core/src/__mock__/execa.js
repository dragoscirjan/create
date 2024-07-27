// // __mocks__/execa.ts
// const execaMock = jest.fn((...args) => {
//   if (args.length === 1 && typeof args[0] === "object") {
//     // Handle call with config object
//     return Promise.resolve({ stdout: "mocked stdout", stderr: "", ...args[0] });
//   }
//   // Handle regular command and arguments
//   return Promise.resolve({ stdout: "mocked output", stderr: "", ...args });
// });

// export const execa = execaMock;
// export default execaMock;
