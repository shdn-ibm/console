import * as React from 'react';
import { ListDropdown } from '@console/internal/components/utils/list-dropdown';
import { referenceForModel } from '@console/internal/module/k8s';
import { BackupPolicyModel } from '../../models';

export const BackupPolicyDropdown: React.FC<BackupPolicyDropdownProps> = (props) => {
  const kind = referenceForModel(BackupPolicyModel);
  const { selectedKey, desc } = props;
  const resources = [{ kind }];
  return (
    <ListDropdown
      {...props}
      desc={desc}
      resources={resources}
      selectedKeyKind={kind}
      placeholder="Select Backup Policy"
      selectedKey={selectedKey}
    />
  );
};

export type BackupPolicyDropdownProps = {
  namespace?: string;
  selectedKey?: string;
  onChange?: (claimName: string, kindLabel?: string, pvc?) => void;
  id?: string;
  desc?: string;
  dataTest?: string;
  dataFilter?: (pvc) => boolean;
};
