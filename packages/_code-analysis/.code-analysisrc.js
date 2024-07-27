export default {
  lint: {
    "src/**/*.ts": ["prettier --write", "eslint --fix", "oxlint --fix"],
  },
  security: {
    audit: { enabled: true },
    snyk: { enabled: true },
  },
  quality: {
    depcruise: {
      enabled: true,
    },
    jscpd: {
      enabled: false,
    },
    sonar: {
      enabled: false,
    },
  },
  dependency: {
    depcheck: {
      command: 'depcheck --ignore-patterns="\\.*rc\\.cjs"',
      enabled: true,
      options: {
        ignoreDevDependencies: true,
      },
    },
    license: {
      enabled: true,
    },
  },
};
