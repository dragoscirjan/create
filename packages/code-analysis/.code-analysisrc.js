export default {
  lint: {
    'src/**/*.ts': ['prettier --write', 'eslint --fix', 'oxlint --fix'],
  },
  security: {
    audit: {enabled: true},
    snyk: {enabled: false},
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
      enabled: true,
      options: {
        ignoreDevDependencies: true,
      },
    },
    licenseCheck: {
      enabled: false,
      options: {
        start: process.cwd(),
      },
    },
  },
};
