import { K8sKind } from '@console/internal/module/k8s';

export const BackupModel: K8sKind = {
  kind: 'BaaSReq',
  label: 'BaaSReq',
  labelPlural: 'baasreqs',
  apiGroup: 'baasreq.baas.io',
  apiVersion: 'v1alpha1',
  abbr: 'BKP',
  namespaced: true,
  crd: true,
  plural: 'baasreqs',
};
