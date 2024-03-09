module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".*\\.spec\\.ts$", // Adjust this regex to match your unit/integration test files
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    testTimeout: 60000,
    
  };
  