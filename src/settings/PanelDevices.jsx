import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';

const PanelDevices = () => {
  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'deviceTitle']}>
        <h1>Painel Aqui</h1>
    </PageLayout>
  );
};

export default PanelDevices;
