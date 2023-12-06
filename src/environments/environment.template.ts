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
        clientSecret: "<<Insert your API secret for client Id findr>>",
        storeKey: "findr-auth@dev"
      }
    }
  },
  app: {
    baseUrl: "/findr/",
    promotionLink: "https://github.com/surcoufx83/sysHUB-Findr",
    minPhraseLength: 3,
    useCache: true,
    webclientLink: 'https://localhost:8443/webclient'
  },
  i10n: {
    fallback: "en",
    locales: ["de", "en"]
  },
  storage: {
    categoriesKey: "findr-syshub-cat@dev",
    configKey: "findr-syshub-config@dev",
    jobtypesKey: "findr-syshub-jobtypes@dev",
    l10nKey: "findr-l10n@dev",
    parametersetKey: "findr-syshub-parameterset@dev",
    searchconfigKey: "findr-searchconfig@dev",
    userconfigKey: "findr-usercfg@dev",
    userdataKey: "findr-userdata@dev",
    workflowsKey: "findr-syshub-workflows@dev",
  }
};
