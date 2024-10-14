import type { Config } from "jest";

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // next.config.js 및 .env 파일을 로드할 Next.js 앱의 경로
  dir: "./",
});

const customJestConfig: Config = {
  rootDir: "./",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  roots: ["./"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  testMatch: ["**/?(*.)+(spec|test).{ts,tsx}"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "dist",
    "<rootDir>/.next/",
  ],
  // 테스트 타임아웃
  testTimeout: 10000,
  // 개별 테스트 결과 표시
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);
