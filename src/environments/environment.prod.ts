import { FindrEnvironment } from "./findr-environment";

export const environment: FindrEnvironment = {
  production: true,
  api: {
    syshub: {
      host: "http://localhost:8088/",
      basic: {
        enabled: false,
        username: "",
        password: "",
        provider: "",
      },
      oauth: {
        enabled: true,
        clientId: "findr",
        clientSecret: "b8gTWYo515b23JLZHuN2rZEZIHS6MKoJuXmNdgTK3Gj5HNdxh7BnyfibyN1A1HLx"
      }
    }
  },
  app: {
    baseUrl: "/findr/",
    promotionLink: "",
    minPhraseLength: 3,
    useCache: true,
  },
  i10n: {
    fallback: "en",
  },
  storage: {
    categoriesKey: "findr-syshub-cat",
    configKey: "findr-syshub-config",
    jobtypesKey: "findr-syshub-jobtypes",
    l10nKey: "findr-l10n",
    parametersetKey: "findr-syshub-parameterset",
    searchconfigKey: "findr-searchconfig",
    tokenKey: "findr-session",
    userconfigKey: "findr-usercfg",
    userdataKey: "findr-userdata",
    workflowsKey: "findr-syshub-workflows",
  }
};
