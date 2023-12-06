import { FindrEnvironment } from "./findr-environment";

export const environment: FindrEnvironment = {
  production: false,
  api: {
    syshub: {
      host: "http://localhost:8088/",
      basic: {
        enabled: false,
        username: "findr",
        password: "findr",
        provider: "findr",
      },
      oauth: {
        enabled: true,
        clientId: "findr",
        clientSecret: "b8gTWYo515b23JLZHuN2rZEZIHS6MKoJuXmNdgTK3Gj5HNdxh7BnyfibyN1A1HLx",
        storeKey: "findr-auth@dev"
      }
    }
  },
  app: {
    baseUrl: "/findr/",
    promotionLink: "https://cdegitlab.westeurope.cloudapp.azure.com/sfuchs/syshubfindr",
    minPhraseLength: 3,
    useCache: true,
  },
  i10n: {
    fallback: "en",
  },
  storage: {
    categoriesKey: "findr-syshub-cat@dev",
    configKey: "findr-syshub-config@dev",
    jobtypesKey: "findr-syshub-jobtypes@dev",
    l10nKey: "findr-l10n@dev",
    parametersetKey: "findr-syshub-parameterset@dev",
    searchconfigKey: "findr-searchconfig@dev",
    tokenKey: "findr-session@dev",
    userconfigKey: "findr-usercfg@dev",
    userdataKey: "findr-userdata@dev",
    workflowsKey: "findr-syshub-workflows@dev",
  }
};
