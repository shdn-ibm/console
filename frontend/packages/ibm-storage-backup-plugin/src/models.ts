import { K8sKind } from '@console/internal/module/k8s';

export const BaaSReqModel: K8sKind = {
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

export const BackupPolicyModel: K8sKind = {
  kind: 'BackupPolicy',
  label: 'BackupPolicy',
  labelPlural: 'backuppolicies',
  apiGroup: 'data-protection.isf.ibm.com',
  apiVersion: 'v1alpha1',
  abbr: 'SLA',
  namespaced: true,
  crd: true,
  plural: 'backuppolicies',
};

export const BackupModel: K8sKind = {
  kind: 'Backup',
  label: 'Backup',
  labelPlural: 'backups',
  apiGroup: 'data-protection.isf.ibm.com',
  apiVersion: 'v1alpha1',
  abbr: 'BKP',
  namespaced: true,
  crd: true,
  plural: 'backups',
};

export const RestoreModel: K8sKind = {
  kind: 'Restore',
  label: 'Restore',
  labelPlural: 'restores',
  apiGroup: 'data-protection.isf.ibm.com',
  apiVersion: 'v1alpha1',
  abbr: 'RST',
  namespaced: true,
  crd: true,
  plural: 'restores',
};

export const BackupStorageLocationModel: K8sKind = {
  kind: 'BackupStorageLocation',
  label: 'BackupStorageLocation',
  labelPlural: 'backupstoragelocations',
  apiGroup: 'data-protection.isf.ibm.com',
  apiVersion: 'v1alpha1',
  abbr: 'BSL',
  namespaced: true,
  crd: true,
  plural: 'backupstoragelocations',
};

export const HookModel: K8sKind = {
  kind: 'Hook',
  label: 'Hook',
  labelPlural: 'hooks',
  apiGroup: 'data-protection.isf.ibm.com',
  apiVersion: 'v1alpha1',
  abbr: 'BHK',
  namespaced: true,
  crd: true,
  plural: 'hooks',
};
