import i18next from 'i18next';
import { ResourceActionFactory } from '@console/app/src/actions/creators/common-factory';
import { Action } from '@console/dynamic-plugin-sdk';
import { asAccessReview } from '@console/internal/components/utils';
import { K8sResourceKind, K8sKind } from '@console/internal/module/k8s';

const labelsModal = (props) =>
  import('./labelResource' /* webpackChunkName: "labelResource" */).then((m) =>
    m.labelsModal(props),
  );
const backupResource = (props) =>
  import('./backupResource' /* webpackChunkName: "backupResource" */).then((m) =>
    m.backupResource(props),
  );

export const BackupActionFactory: ResourceActionFactory = {
  CreateBackup: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: `create-backup`,
    label: i18next.t('Create Backup'),
    // cta: {
    //  href: `/k8s/ns/${obj.metadata.namespace}/data-protection.isf.ibm.com~v1alpha1~Backup/~new`,
    // },
    cta: () =>
      backupResource({
        kind,
        resource: obj,
        blocking: true,
      }),
    accessReview: asAccessReview(kind, obj, 'update'),
  }),
  AddtoBackupJob: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'add-to-backup',
    label: i18next.t('Add to Backup Job'),
    cta: () =>
      labelsModal({
        kind,
        resource: obj,
        blocking: true,
      }),
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'patch',
    },
  }),
};

export const getBackupActions = (kind: K8sKind, obj: K8sResourceKind): Action[] => {
  return [
    BackupActionFactory.CreateBackup(kind, obj),
    BackupActionFactory.AddtoBackupJob(kind, obj),
  ];
};
