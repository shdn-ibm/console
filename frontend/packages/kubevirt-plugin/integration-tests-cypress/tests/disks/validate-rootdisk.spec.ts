import { testName } from '../../support';
import { Disk, VirtualMachineData } from '../../types/vm';
import { bootsourceError } from '../../utils/const/errorString';
import { TEMPLATE } from '../../utils/const/index';
import { ProvisionSource } from '../../utils/const/provisionSource';
import { addDisk } from '../../views/dialog';
import {
  cancelBtn,
  deleteBtn,
  kebabBtn,
  rootdisk,
  selectBootSource,
} from '../../views/selector-wizard';
import { virtualization } from '../../views/virtualization';
import { wizard } from '../../views/wizard';

const blankDisk: Disk = {
  name: 'blank-disk',
  source: ProvisionSource.BLANK,
  size: '1',
};

const registryDisk: Disk = {
  name: 'registry-disk',
  source: ProvisionSource.REGISTRY,
  size: '1',
};

const ephemeralDisk: Disk = {
  name: 'ephemeral-disk',
  source: ProvisionSource.EPHEMERAL,
};

const vmData: VirtualMachineData = {
  name: `validate-rootdisk-${testName}`,
  namespace: testName,
  template: TEMPLATE.WIN10,
  provisionSource: ProvisionSource.REGISTRY,
  pvcSize: '1',
};

function visitStorageStep(data: VirtualMachineData) {
  virtualization.vms.visit();
  wizard.vm.open();
  wizard.vm.selectTemplate(data);
  cy.byLegacyTestID('wizard-customize').click();
  wizard.vm.fillGeneralForm(data);
  wizard.vm.fillNetworkForm(data);
}

function checkDiskBootable(diskName: string, bootable: boolean) {
  cy.get(selectBootSource).select(diskName);
  if (bootable) {
    cy.contains(bootsourceError).should('not.exist');
  } else {
    cy.contains(bootsourceError).should('exist');
  }
}

describe('Validate root disk', () => {
  before(() => {
    cy.Login();
    cy.visit('/');
  });

  beforeEach(() => {
    visitStorageStep(vmData);
  });

  afterEach(() => {
    cy.get(cancelBtn).click();
    cy.get('button')
      .contains('Cancel')
      .click();
  });

  it('ID(CNV-5469) Blank disk cannot be used as bootdisk', () => {
    addDisk(blankDisk);
    checkDiskBootable(blankDisk.name, false);
  });

  it('ID(CNV-5468) Ephemeral disk can be used as bootdisk', () => {
    addDisk(ephemeralDisk);
    checkDiskBootable(ephemeralDisk.name, true);
  });

  it('ID(CNV-5628) Registry disk can be used as bootdisk', () => {
    // TODO: add https://bugzilla.redhat.com/show_bug.cgi?id=1999360 into considerations
    // test with a template with boot source available

    // add a check about rootdisk is able to be deleted.
    cy.get(rootdisk)
      .find(kebabBtn)
      .click();
    cy.get(deleteBtn).click();

    addDisk(registryDisk);
    checkDiskBootable(registryDisk.name, true);
  });
});
