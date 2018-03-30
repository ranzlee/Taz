/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

/* Route data definition */
interface RouteData {
  authorizedPolicies: Array<Taz.Model.Security.PolicyTypeEnum>;
  isDynamicMenuItem: boolean;
}
