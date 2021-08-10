import * as React from 'react';
import { getCommonResourceActions } from '@console/app/src/actions/creators/common-factory';
import { K8sResourceKind, referenceFor } from '@console/internal/module/k8s';
import { useK8sModel } from '@console/shared/src/hooks/useK8sModel';
import { getBackupActions } from '../creators/backup-factory';

export const useNamespaceActionsProvider = (resource: K8sResourceKind) => {
  const [kindObj, inFlight] = useK8sModel(referenceFor(resource));

  const namespaceActions = React.useMemo(
    () => [...getBackupActions(kindObj, resource), ...getCommonResourceActions(kindObj, resource)],
    [kindObj, resource],
  );

  return [namespaceActions, !inFlight, undefined];
};

export const useWorkloadActionsProvider = (resource: K8sResourceKind) => {
  const [kindObj, inFlight] = useK8sModel(referenceFor(resource));

  const namespaceActions = React.useMemo(() => [...getBackupActions(kindObj, resource)], [
    kindObj,
    resource,
  ]);

  return [namespaceActions, !inFlight, undefined];
};
