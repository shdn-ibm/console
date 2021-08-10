// @ts-nocheck
import * as React from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import {
  createModalLauncher,
  ModalTitle,
  ModalBody,
  ModalSubmitFooter,
} from '@console/internal/components/factory';
import { withHandlePromise } from '@console/internal/components/utils';
import { k8sCreate, apiVersionForModel } from '@console/internal/module/k8s';
import { BackupModel } from '../../models';

function dateFormat(n) {
  return n > 9 ? `${n}` : `0${n}`;
}

const BaseBackupModal = withHandlePromise((props) => {
  const [errorMessage] = React.useState();
  const { t } = useTranslation();

  const myDate = new Date();
  const mytime = `${myDate.getFullYear().toString() +
    dateFormat(myDate.getMonth()).toString() +
    dateFormat(myDate.getDate()).toString()}-${dateFormat(
    myDate.getHours(),
  ).toString()}${dateFormat(myDate.getMinutes()).toString()}${dateFormat(
    myDate.getSeconds(),
  ).toString()}`;

  const defaultBackupName = `backup-${props.resource.metadata.name}-${mytime}`;
  const [backupName, setBackupName] = React.useState(defaultBackupName);

  const submit = (e) => {
    e.preventDefault();

    const payload = {
      apiVersion: apiVersionForModel(BackupModel),
      kind: BackupModel.kind,
      metadata: {
        name: backupName,
        namespace: props.resource.metadata.namespace,
      },
      spec: {
        application: backupName,
      },
    };
    const promise = k8sCreate(BackupModel, payload);
    props.handlePromise(promise, props.close);
  };

  const handleBackupNameChange = (name) => {
    setBackupName(name);
  };

  return (
    <form onSubmit={submit} name="form" className="modal-content">
      <ModalTitle>{t('create backup')}</ModalTitle>
      <ModalBody>
        <div className="row co-m-form-row">
          <div className="col-sm-12">
            <FormGroup
              className="create-backup-with-cap"
              label={t('Backup Name')}
              isRequired
              fieldId="backupname-input"
            >
              <TextInput
                id="backupname-input"
                value={backupName}
                type="text"
                onChange={handleBackupNameChange}
                isRequired
              />
            </FormGroup>
          </div>
        </div>
      </ModalBody>
      <ModalSubmitFooter
        errorMessage={errorMessage}
        inProgress={false}
        submitText={t('Create')}
        cancel={props.cancel}
      />
    </form>
  );
});

export const backupResource = createModalLauncher((props) => <BaseBackupModal {...props} />);
