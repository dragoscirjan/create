export default {
  lint: {
    'src/**/*.ts': ['prettier --write', 'eslint --fix', 'oxlint --fix'],
  },
  // security: {
  //   audit: {enabled: true},
  //   snyk: {enabled: true},
  // },
  // quality: {
  //   depcruise: {
  //     enabled: true,
  //   },
  //   jscpd: {
  //     enabled: true,
  //   },
  //   sonar: {
  //     enabled: false,
  //   },
  // },
  // dependency: {
  //   depcheck: {
  //     enabled: true,
  //     options: {
  //       ignoreDevDependencies: true,
  //     },
  //   },
  //   licenseCheck: {
  //     enabled: false,
  //     options: {
  //       start: process.cwd(),
  //     },
  //   },
  // },
};
