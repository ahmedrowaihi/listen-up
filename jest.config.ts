import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'babel-jest',
		'^.+\\.jsx?$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(chalk)/)', // Add other packages if needed
	],
	testEnvironment: 'node',
	collectCoverage: true,
	coverageReporters: ['text', 'lcov'],
	coverageDirectory: 'coverage',
	testMatch: ['**/__tests__/**/*.test.ts'],
	preset: 'ts-jest/presets/js-with-ts',
};

export default config;
