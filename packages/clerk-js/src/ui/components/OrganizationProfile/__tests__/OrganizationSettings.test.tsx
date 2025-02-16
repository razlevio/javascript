import { describe, it } from '@jest/globals';
import React from 'react';

import { render } from '../../../../testUtils';
import { bindCreateFixtures } from '../../../utils/test/createFixtures';
import { OrganizationSettings } from '../OrganizationSettings';

const { createFixtures } = bindCreateFixtures('OrganizationProfile');

describe('OrganizationSettings', () => {
  it('enables organization profile button and disables leave when user is admin', async () => {
    const { wrapper } = await createFixtures(f => {
      f.withOrganizations();
      f.withUser({ email_addresses: ['test@clerk.dev'], organization_memberships: [{ name: 'Org1', role: 'admin' }] });
    });

    const { getByText } = render(<OrganizationSettings />, { wrapper });
    expect(getByText('Settings')).toBeDefined();
    expect(getByText('Org1', { exact: false }).closest('button')).not.toBeNull();
    expect(getByText(/leave organization/i, { exact: false }).closest('button')).toHaveAttribute('disabled');
  });

  it('disables organization profile button and enables leave when user is not admin', async () => {
    const { wrapper } = await createFixtures(f => {
      f.withOrganizations();
      f.withUser({
        email_addresses: ['test@clerk.dev'],
        organization_memberships: [{ name: 'Org1', role: 'basic_member' }],
      });
    });

    const { getByText } = render(<OrganizationSettings />, { wrapper });
    expect(getByText('Settings')).toBeDefined();
    expect(getByText('Org1', { exact: false }).closest('button')).toBeNull();
    expect(getByText(/leave organization/i, { exact: false }).closest('button')).not.toHaveAttribute('disabled');
  });

  describe('Navigation', () => {
    it('navigates to Organization Profile edit page when clicking on organization name and user is admin', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withOrganizations();
        f.withUser({
          email_addresses: ['test@clerk.dev'],
          organization_memberships: [{ name: 'Org1', role: 'admin' }],
        });
      });

      const { getByText, userEvent } = render(<OrganizationSettings />, { wrapper });
      await userEvent.click(getByText('Org1', { exact: false }));
      expect(fixtures.router.navigate).toHaveBeenCalledWith('profile');
    });

    it('navigates to Leave Organization page when clicking on the respective button and user is not admin', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withOrganizations();
        f.withUser({
          email_addresses: ['test@clerk.dev'],
          organization_memberships: [{ name: 'Org1', role: 'basic_member' }],
        });
      });

      const { getByText, userEvent } = render(<OrganizationSettings />, { wrapper });
      await userEvent.click(getByText(/leave organization/i, { exact: false }));
      expect(fixtures.router.navigate).toHaveBeenCalledWith('leave');
    });
  });
});
