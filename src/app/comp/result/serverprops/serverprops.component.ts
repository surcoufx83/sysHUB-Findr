import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchResult, SimpleKeyValue } from 'src/app/types';

@Component({
  selector: 'app-result-serverprops',
  templateUrl: './serverprops.component.html',
  styleUrl: './serverprops.component.scss'
})
export class ServerpropsComponent implements OnInit {

  serverProperties: SimpleKeyValue[] = [];
  @Input({ required: true }) searchResult!: SearchResult;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    let tempserverProperties: SimpleKeyValue[] = [];
    if (this.searchResult!.result?.system?.serverConfig === undefined || this.searchResult!.result?.system?.serverConfig === null || this.searchResult!.result?.system?.serverConfig === false)
      return;
    Object.entries(this.searchResult!.result.system.serverConfig.content).forEach((kvpair) => {
      tempserverProperties.push({ key: kvpair[0], value: this.ngOnInit_prepareServerConfig_convert(kvpair[1]) });
    });
    this.serverProperties = [...tempserverProperties].sort((a, b) => a.key.toLocaleLowerCase() > b.key.toLocaleLowerCase() ? 1 : a.key.toLocaleLowerCase() < b.key.toLocaleLowerCase() ? -1 : a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase() ? 1 : a.value.toLocaleLowerCase() < b.value.toLocaleLowerCase() ? -1 : 0);
  }

  ngOnInit_prepareServerConfig_convert(strin: any): any {
    if (!strin)
      return '';
    const teststr = `${strin}`.toLocaleLowerCase();
    if (teststr === 'true' || teststr === 'false')
      return teststr === 'true' ? true : false;
    if (!isNaN(Number(teststr)))
      return Number(teststr);
    return strin;
  }

  selectNode(node: SimpleKeyValue): void {
    this.propsService.inspect('ServerConfig', <ServerProperties>{
      key: node.key,
      value: node.value,
      properties: ServerPropertiesDefinition[node.key],
    });
  }

}

export type ServerProperties = {
  key: string;
  value: string;
  properties?: PropertyDefinition;
}

export type PropertyDefinition = {
  type: string;
  refs: [string, string][];
};

export const ServerPropertiesDefinition: { [key: string]: PropertyDefinition } = {
  'base.class.publisher.port': {
    type: 'Integer',
    refs: [
      ['2023 Port settings - Serverconfiguration', 'https://ntware.atlassian.net/wiki/spaces/KB/pages/11770895110/2023+Port+settings?parentProduct=JSM-Portal&parentProductContentContainerId=10024&initialAllowedFeatures=disable-login-flow.disable-share&locale=en-US#:~:text=base.class.publisher.port'],
      ['2023 MSMQ Input Channel - Preconditions', 'https://ntware.atlassian.net/wiki/spaces/KB/pages/11770866984/2023+MSMQInputChannel?parentProduct=JSM-Portal&parentProductContentContainerId=10024&initialAllowedFeatures=disable-login-flow.disable-share&locale=en-US#:~:text=base.class.publisher.port'],
    ]
  },
  'base.class.publisher.useSSL': { type: 'Boolean', refs: [] },
  'base.sshd.console.port': { type: 'Integer', refs: [] },
  'base.syslog.customstoredprocedure': { type: 'String', refs: [] },
  'base.syslog.daysholddebug': { type: 'Integer', refs: [] },
  'base.syslog.daysholderror': { type: 'Integer', refs: [] },
  'base.syslog.daysholdfatal': { type: 'Integer', refs: [] },
  'base.syslog.daysholdinfo': { type: 'Integer', refs: [] },
  'base.syslog.daysholdwarn': { type: 'Integer', refs: [] },
  'base.syslog.deletepackage': { type: 'Integer', refs: [] },
  'base.syslog.maxrowstodelete': { type: 'Integer', refs: [] },
  'base.syslog.trigger': { type: 'Cron Expression', refs: [] },
  'base.system.fullQualifiedHostname': { type: 'String', refs: [] },
  'base.system.name': { type: 'String', refs: [] },
  'base.trustedServers.UNC': { type: 'String', refs: [] },
  'base.userlog.customstoredprocedure': { type: 'String', refs: [] },
  'base.userlog.daysholddebug': { type: 'Integer', refs: [] },
  'base.userlog.daysholderror': { type: 'Integer', refs: [] },
  'base.userlog.daysholdfatal': { type: 'Integer', refs: [] },
  'base.userlog.daysholdinfo': { type: 'Integer', refs: [] },
  'base.userlog.daysholdwarn': { type: 'Integer', refs: [] },
  'base.userlog.deletepackage': { type: 'Integer', refs: [] },
  'base.userlog.maxrowstodelete': { type: 'Integer', refs: [] },
  'base.userlog.trigger': { type: 'Cron Expression', refs: [] },
  'enabledProtocols': { type: 'String', refs: [] },
  'gitBranchName': { type: 'String', refs: [] },
  'gitRepositoryPassword': { type: 'String', refs: [] },
  'gitRepositoryUser': { type: 'String', refs: [] },
  'hazelcast.slow.operation.detector.enabled': { type: 'Boolean', refs: [] },
  'hazelcast.slow.operation.detector.log.purge.interval.seconds': { type: 'Integer', refs: [] },
  'hazelcast.slow.operation.detector.log.retention.seconds': { type: 'Integer', refs: [] },
  'hazelcast.slow.operation.detector.stacktrace.logging.enabled': { type: 'Boolean', refs: [] },
  'httpProcsNoHostCheck': { type: 'Boolean', refs: [] },
  'hz.instance.name': { type: 'String', refs: [] },
  'hz.members': { type: 'String', refs: [] },
  'hz.network.port': { type: 'Integer', refs: [] },
  'hz.network.port.auto.increment': { type: 'Boolean', refs: [] },
  'hz.node.name': { type: 'String', refs: [] },
  'hz.tcp.ip.enabled': { type: 'Boolean', refs: [] },
  'hz.use.jmx': { type: 'Boolean', refs: [] },
  'javax.net.ssl.keyPassword': { type: 'Password', refs: [] },
  'javax.net.ssl.keyStore': { type: 'File', refs: [] },
  'javax.net.ssl.keyStorePassword': { type: 'Password', refs: [] },
  'javax.net.ssl.keyStoreType': { type: 'String', refs: [] },
  'javax.net.ssl.trustStore': { type: 'File', refs: [] },
  'javax.net.ssl.trustStorePassword': { type: 'Password', refs: [] },
  'javax.net.ssl.trustStoreType': { type: 'String', refs: [] },
  'jetty.cert.alias': { type: 'String', refs: [] },
  'jetty.http.port': { type: 'Integer', refs: [] },
  'jetty.http.timeout': { type: 'Integer', refs: [] },
  'jetty.https.port': { type: 'Integer', refs: [] },
  'jetty.https.timeout': { type: 'Integer', refs: [] },
  'jetty.jmx': { type: 'Boolean', refs: [] },
  'jetty.requestlog': { type: 'Boolean', refs: [] },
  'jetty.sniHostCheck': { type: 'Boolean', refs: [] },
  'jetty.stsIncludeSubDomains': { type: 'Boolean', refs: [] },
  'jetty.stsMaxAge': { type: 'Integer', refs: [] },
  'jetty.threadPool.idleTimeout': { type: 'Integer', refs: [] },
  'jetty.threadPool.maxThreads': { type: 'Integer', refs: [] },
  'jetty.threadPool.minThreads': { type: 'Integer', refs: [] },
  'jms.broker.memory': { type: 'String', refs: [] },
  'jms.broker.password': { type: 'Password', refs: [] },
  'jms.broker.persistent': { type: 'Boolean', refs: [] },
  'jms.broker.port': { type: 'Integer', refs: [] },
  'jms.broker.schema': { type: 'String', refs: [] },
  'jms.broker.stomp.port': { type: 'Integer', refs: [] },
  'jms.broker.storage': { type: 'String', refs: [] },
  'jms.broker.temp': { type: 'String', refs: [] },
  'jms.broker.use.jmx': { type: 'Boolean', refs: [] },
  'jms.con.block.session.full': { type: 'Boolean', refs: [] },
  'jms.con.max': { type: 'Integer', refs: [] },
  'jms.con.timeout': { type: 'Integer', refs: [] },
  'jms.receive.timeout': { type: 'Integer', refs: [] },
  'jms.session.per.con.max': { type: 'Integer', refs: [] },
  'ldap.logonRole': { type: 'String', refs: [] },
  'ldap.objectClass': { type: 'String', refs: [] },
  'ldap.providerURLList': { type: 'String', refs: [] },
  'ldap.searchName': { type: 'String', refs: [] },
  'ldap.tu.logonRole': { type: 'String', refs: [] },
  'ldap.tu.populateNestedGroupsAD': { type: 'Boolean', refs: [] },
  'ldap.tu.providerURLList': { type: 'String', refs: [] },
  'ldap.tu.searchFilter': { type: 'String', refs: [] },
  'ldap.tu.searchName': { type: 'String', refs: [] },
  'ldap.tu.serviceUserDN': { type: 'String', refs: [] },
  'ldap.tu.serviceUserPassword': { type: 'Password', refs: [] },
  'ldap.userDomain': { type: 'String', refs: [] },
  'ldap.userPrincipalName': { type: 'String', refs: [] },
  'mirror.listener.name': { type: 'String', refs: [] },
  'mirror.listener.port': { type: 'Integer', refs: [] },
  'mirror.listener.use.ssl': { type: 'Boolean', refs: [] },
  'nativeclient.filestatus.sortorder': { type: 'String', refs: [] },
  'restapi.swagger.overwrite.url': { type: 'String', refs: [] },
  'restapi.swagger.showInternalRestAPI': { type: 'Boolean', refs: [] },
  'restapi.swagger.showRestAPI': { type: 'Boolean', refs: [] },
  'restapi.workflowExecution.paraToAttributes': { type: 'Boolean', refs: [] },
  'restapi.workflowExecution.resolveMediaType': { type: 'Boolean', refs: [] },
  'restapi.workflowExecution.useOnlyFileStatusEntries': { type: 'Boolean', refs: [] },
  'vertx.disableFileCaching': { type: 'Boolean', refs: [] },
  'vertx.disableFileCPResolving': { type: 'Boolean', refs: [] },
}
