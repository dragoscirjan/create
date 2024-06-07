export default {
  lint: {
    'src/**/*.ts': ['prettier --write', 'eslint --color --fix', 'oxlint --fix'],
  },
  security: {
    audit: {enabled: true},
    snyk: {enabled: true},
  },
  quality: {
    depcruise: {
      enabled: true,
    },
    jscpd: {
      enabled: true,
    },
    sonar: {
      enabled: true,
    },
  },
  dependency: {
    depcheck: {
      enabled: true,
      command: 'depcheck . --ignores=@jscpd/html-reporter,depcheck,dependency-cruiser,jscpd,snyk',
    },
    licenseCheck: {
      enabled: true,
      options: {
        start: process.cwd(),
      },
    },
  },
};
