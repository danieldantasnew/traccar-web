import React from 'react';
import {
  Divider, List,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';
import MenuItem from '../../common/components/MenuItem';
import { faBell, faBullhorn, faCalendarDays, faCircleQuestion, faDatabase, faEarthAmericas, faGear, faLayerGroup, faList, faMobileScreenButton, faTerminal, faUser, faUsers, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const manager = useManager();
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);

  const features = useFeatures();

  return (
    <>
      <List>
        <MenuItem
          title={t('sharedPreferences')}
          link="/settings/preferences"
          icon={<FontAwesomeIcon icon={faGear} size='lg' />}
          selected={location.pathname === '/settings/preferences'}
        />
        {!readonly && (
          <>
            <MenuItem
              title={t('sharedNotifications')}
              link="/settings/notifications"
              icon={<FontAwesomeIcon icon={faBell} size='lg'/>}
              selected={location.pathname.startsWith('/settings/notification')}
            />
            <MenuItem
              title={t('settingsUser')}
              link={`/settings/user/${userId}`}
              icon={<FontAwesomeIcon icon={faUser} size='lg'/>}
              selected={location.pathname === `/settings/user/${userId}`}
            />
            <MenuItem
              title={t('deviceTitle')}
              link="/settings/devices"
              icon={<FontAwesomeIcon icon={faMobileScreenButton} size='lg' />}
              selected={location.pathname.startsWith('/settings/device')}
            />
            <MenuItem
              title={t('sharedGeofences')}
              link="/geofences"
              icon={<FontAwesomeIcon icon={faEarthAmericas} size='lg'/>}
              selected={location.pathname.startsWith('/settings/geofence')}
            />
            {!features.disableGroups && (
              <MenuItem
                title={t('settingsGroups')}
                link="/settings/groups"
                icon={<FontAwesomeIcon icon={faLayerGroup} size='lg' />}
                selected={location.pathname.startsWith('/settings/group')}
              />
            )}
            {!features.disableDrivers && (
              <MenuItem
                title={t('sharedDrivers')}
                link="/settings/drivers"
                icon={<FontAwesomeIcon icon={faUsers} size='lg' />}
                selected={location.pathname.startsWith('/settings/driver')}
              />
            )}
            {!features.disableCalendars && (
              <MenuItem
                title={t('sharedCalendars')}
                link="/settings/calendars"
                icon={<FontAwesomeIcon icon={faCalendarDays} size='lg'/>}
                selected={location.pathname.startsWith('/settings/calendar')}
              />
            )}
            {!features.disableComputedAttributes && (
              <MenuItem
                title={t('sharedComputedAttributes')}
                link="/settings/attributes"
                icon={<FontAwesomeIcon icon={faList} size='lg'/>}
                selected={location.pathname.startsWith('/settings/attribute')}
              />
            )}
            {!features.disableMaintenance && (
              <MenuItem
                title={t('sharedMaintenance')}
                link="/settings/maintenances"
                icon={<FontAwesomeIcon icon={faWrench} size='lg' />}
                selected={location.pathname.startsWith('/settings/maintenance')}
              />
            )}
            {!features.disableSavedCommands && (
              <MenuItem
                title={t('sharedSavedCommands')}
                link="/settings/commands"
                icon={<FontAwesomeIcon icon={faTerminal} size='lg' />}
                selected={location.pathname.startsWith('/settings/command')}
              />
            )}
            {supportLink && (
              <MenuItem
                title={t('settingsSupport')}
                link={supportLink}
                icon={<FontAwesomeIcon icon={faCircleQuestion} />}
              />
            )}
          </>
        )}
      </List>
      {manager && (
        <>
          <Divider />
          <List>
            <MenuItem
              title={t('serverAnnouncement')}
              link="/settings/announcement"
              icon={<FontAwesomeIcon icon={faBullhorn} size='sm' />}
              selected={location.pathname === '/settings/announcement'}
            />
            {admin && (
              <MenuItem
                title={t('settingsServer')}
                link="/settings/server"
                icon={<FontAwesomeIcon icon={faDatabase} size='sm'/>}
                selected={location.pathname === '/settings/server'}
              />
            )}
            <MenuItem
              title={t('settingsUsers')}
              link="/settings/users"
              icon={<FontAwesomeIcon icon={faUsers} size='sm' />}
              selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
            />
          </List>
        </>
      )}
    </>
  );
};

export default SettingsMenu;
