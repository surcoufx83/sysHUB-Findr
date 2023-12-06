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
        clientSecret: "<<Insert your API secret for client Id findr>>",
        storeKey: "findr-auth"
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
    userconfigKey: "findr-usercfg",
    userdataKey: "findr-userdata",
    workflowsKey: "findr-syshub-workflows",
  }
};
