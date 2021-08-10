// @ts-nocheck
import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  createModalLauncher,
  ModalTitle,
  ModalBody,
  ModalSubmitFooter,
} from '@console/internal/components/factory';
import { ResourceIcon, SelectorInput, withHandlePromise } from '@console/internal/components/utils';
import { k8sPatch, referenceForModel } from '@console/internal/module/k8s';
import { BackupPolicyDropdown } from './back-policy-dropdown';

const LABELS_PATH = '/metadata/labels';
const TEMPLATE_SELECTOR_PATH = '/spec/template/metadata/labels';
const BACKUP_POLICY_PREFIX = 'data-protection.ibm.com/policy=';

const BaseLabelsModal = withHandlePromise((props) => {
  const [labels, setLabels] = React.useState(
    SelectorInput.arrayify(_.get(props.resource, props.path.split('/').slice(1))),
  );
  const [errorMessage] = React.useState();
  const createPath = !labels.length;
  const { t } = useTranslation();

  const submit = (e) => {
    e.preventDefault();

    const { kind, path, resource, isPodSelector } = props;

    const patch = [
      {
        op: createPath ? 'add' : 'replace',
        path,
        value: SelectorInput.objectify(labels),
      },
    ];

    // https://kubernetes.io/docs/user-guide/deployments/#selector
    //   .spec.selector must match .spec.template.metadata.labels, or it will be rejected by the API
    const updateTemplate =
      isPodSelector && !_.isEmpty(_.get(resource, TEMPLATE_SELECTOR_PATH.split('/').slice(1)));

    if (updateTemplate) {
      patch.push({
        path: TEMPLATE_SELECTOR_PATH,
        op: 'replace',
        value: SelectorInput.objectify(labels),
      });
    }
    const promise = k8sPatch(kind, resource, patch);
    props.handlePromise(promise, props.close);
  };

  const { kind, resource, descriptionKey, messageKey, messageVariables, labelClassName } = props;

  const [policyName, setPolicyName] = React.useState('');
  const handlePolicyName = (name) => {
    setPolicyName(name);
    setLabels(labels.concat([BACKUP_POLICY_PREFIX + name]));
  };

  const backupLabels = labels.filter((label) => label.includes(BACKUP_POLICY_PREFIX));
  const otherLabels = labels.filter((label) => !label.includes(BACKUP_POLICY_PREFIX));
  const handleLabelsChange = (newlabels) => {
    setLabels(otherLabels.concat(newlabels));
  };

  return (
    <form onSubmit={submit} name="form" className="modal-content">
      <ModalTitle>
        {descriptionKey
          ? t('public~Edit {{description}}', { description: t(descriptionKey) })
          : t('public~Edit backup configurations')}
      </ModalTitle>
      <ModalBody>
        <div className="row co-m-form-row">
          <div className="col-sm-12">
            {messageKey
              ? t(messageKey, messageVariables)
              : t(
                  'public~This configuration wizard will let you add the resource to a backup policy',
                )}
          </div>
        </div>
        <div className="row co-m-form-row">
          <div className="col-sm-12">
            <label htmlFor="tags-input" className="control-label">
              {descriptionKey
                ? t('{{description}} for', { description: t(descriptionKey) })
                : t('public~Select Backup Policy for')}{' '}
              <ResourceIcon kind={kind.crd ? referenceForModel(kind) : kind.kind} />{' '}
              {resource.metadata.name}
            </label>
            <SelectorInput
              onChange={(l) => handleLabelsChange(l)}
              tags={backupLabels}
              placeholder={'select policy'}
              labelClassName={labelClassName || `co-text-${kind.id}`}
              autoFocus
            />
            <BackupPolicyDropdown
              dataTest="backup-policy-dropdown"
              onChange={handlePolicyName}
              selectedKey={policyName}
              desc={`Backup Policy`}
            />
          </div>
        </div>
      </ModalBody>
      <ModalSubmitFooter
        errorMessage={errorMessage}
        inProgress={false}
        submitText={t('public~Save')}
        cancel={props.cancel}
      />
    </form>
  );
});

export const labelsModal = createModalLauncher((props) => (
  <BaseLabelsModal path={LABELS_PATH} {...props} />
));
