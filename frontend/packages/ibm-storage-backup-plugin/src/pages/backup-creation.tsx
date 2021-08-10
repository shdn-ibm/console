import * as React from 'react';
import { ActionGroup, FormGroup, TextInput, Button } from '@patternfly/react-core';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ButtonBar, history, resourceObjPath } from '@console/internal/components/utils';
import { k8sCreate, K8sResourceKind, referenceFor } from '@console/internal/module/k8s';
import { BackupPolicyDropdown } from '../actions/creators/back-policy-dropdown';
import { BackupModel } from '../models';
import './backup-creation.scss';

export const CreateBackupForm: React.FC<CreateBackupFormProps> = (props) => {
  const { t } = useTranslation();
  const [backupName, setBackupName] = React.useState('');
  const [appName, setAppName] = React.useState('');
  const [policyName, setPolicyName] = React.useState('');
  const { namespace, onChange } = props;

  React.useEffect(() => {
    const updatebackup = (): K8sResourceKind => {
      const obj: K8sResourceKind = {
        apiVersion: `${BackupModel.apiGroup}/${BackupModel.apiVersion}`,
        kind: BackupModel.kind,
        metadata: {
          name: backupName,
          namespace,
        },
        spec: {
          application: appName,
          backupPolicy: policyName,
        },
      };
      return obj;
    };
    onChange(updatebackup);
  }, [appName, backupName, namespace, onChange, policyName]);

  const handleBackupNameChange = (value: string) => {
    setBackupName(value);
  };
  const handleAppNameChange = (value: string) => {
    setAppName(value);
  };
  const handlePolicyNameChange = (value: string) => {
    setPolicyName(value);
  };
  return (
    <>
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
      <FormGroup
        className="create-backup-with-cap"
        label={t('Application Name')}
        isRequired
        fieldId="application-input"
      >
        <TextInput
          id="application-input"
          value={appName}
          type="text"
          onChange={handleAppNameChange}
          isRequired
        />
      </FormGroup>
      <FormGroup className="create-backup-with-cap" label={t('Policy Name')} fieldId="policy-input">
        <BackupPolicyDropdown
          dataTest="backup-policy-dropdown"
          onChange={handlePolicyNameChange}
          selectedKey={policyName}
          desc={`Backup Policy`}
        />
      </FormGroup>
    </>
  );
};

export const BackupCreationPage: React.FC<CreateBackupProps> = (props) => {
  const { t } = useTranslation();
  const [error, setError] = React.useState('');
  const [inProgress, setInProgress] = React.useState(false);
  const [backupObj, setBackupObj] = React.useState(null);
  const { namespace } = props;
  const title = t('Create Backup');

  const save = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setInProgress(true);
    k8sCreate(BackupModel, backupObj)
      .then(
        (resource) => {
          setInProgress(false);
          history.push(resourceObjPath(resource, referenceFor(resource)));
        },
        ({ message }: { message: string }) => {
          setError(message || 'Could not create backup.');
          setInProgress(false);
        },
      )
      .catch((err) => {
        throw err;
      });
  };

  return (
    <div className="co-m-pane__body">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
        <div className="co-m-pane__name">{title}</div>
      </h1>
      <form className="co-m-pane__body-group" onSubmit={save}>
        <CreateBackupForm onChange={setBackupObj} namespace={namespace} />
        <ButtonBar errorMessage={error} inProgress={inProgress}>
          <ActionGroup className="pf-c-form">
            <Button id="save-changes" data-test="create-backup" type="submit" variant="primary">
              {t('Create')}
            </Button>
            <Button onClick={history.goBack} type="button" variant="secondary">
              {t('Cancel')}
            </Button>
          </ActionGroup>
        </ButtonBar>
      </form>
    </div>
  );
};

export type CreateBackupFormProps = {
  namespace?: string;
  onChange: (K8sResourceKind) => void;
};

export type CreateBackupProps = {
  namespace?: string;
};
