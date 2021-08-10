import i18next from 'i18next';
import { Action } from '@console/dynamic-plugin-sdk';
import { configureUpdateStrategyModal } from '@console/internal/components/modals';
import { asAccessReview } from '@console/internal/components/utils';
import { K8sResourceKind, K8sKind } from '@console/internal/module/k8s';
//import { ResourceActionFactory } from './common-factory';
import { ResourceActionFactory } from '@console/app/src/actions/creators/common-factory';

export const BackupActionFactory: ResourceActionFactory = {
  CreateBackup: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: `create-backup`,
    label: i18next.t('Create Backup'),
    cta: {
      href: `/edit-deployment/ns/${obj.metadata.namespace}?name=${obj.metadata.name}&kind=${kind.kind}`,
    },
    // TODO: Fallback to "View YAML"? We might want a similar fallback for annotations, labels, etc.
    accessReview: asAccessReview(kind, obj, 'update'),
  }),
  AddtoBackupJob: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'add-to-backup',
    label: i18next.t('Add to Backup Job'),
    cta: () => configureUpdateStrategyModal({ deployment: obj }),
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
