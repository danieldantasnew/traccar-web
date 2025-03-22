import * as React from 'react';
import { Menu, MenuItem, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { faClockRotateLeft, faEarthAmericas, faEllipsis, faEyeSlash, faLocationCrosshairs, faMapLocationDot, faPen, faShareNodes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DynamicIconsComponent } from './DynamicIcons';

const RotateIconButton = styled(IconButton)(({ open }) => ({
    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
}));

const options = [
    { icon: <FontAwesomeIcon icon={faPen} size='lg' color='#6D6D6D'/>, label: 'Editar veículo' },
    { icon: <FontAwesomeIcon icon={faShareNodes} size='lg' color='#6D6D6D' />, label: 'Compartilhar localização' },
    { icon: <DynamicIconsComponent category={"bellRing"} style={{width: '20px', color: '#6D6D6D'}}/>, label: 'Avise-me quando ligar' },
    { icon: <FontAwesomeIcon icon={faLocationCrosshairs} size='lg' color='#6D6D6D' />, label: 'Centralizar veículo' },
    { icon: <FontAwesomeIcon icon={faEyeSlash} size='lg' color='#6D6D6D' />, label: 'Ocultar rota do mapa' },
    { icon: <FontAwesomeIcon icon={faClockRotateLeft} size='lg' color='#6D6D6D' />, label: 'Replay' },
    { icon: <FontAwesomeIcon icon={faMapLocationDot} size='lg' color='#6D6D6D' />, label: 'Google Maps' },
    { icon: <FontAwesomeIcon icon={faEarthAmericas} size='lg' color='#6D6D6D'/>, label: 'Criar cerca' },
    { icon: <FontAwesomeIcon icon={faTrash} color='red' size='lg'/>, label: 'Remover veículo' },
];

const PlusOpt = ({device}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const attributes = device.attributes || {};
    const reportColor = attributes["web.reportColor"]
      ? attributes["web.reportColor"].split(";")
      : ["rgb(189, 12, 18)", "rgb(189, 12, 18)"];
  
    const bgColor = reportColor[0];
    const textColor = reportColor[1];

    const handleEventIcon = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
    <Box sx={{position: 'absolute', right: '.5rem', bottom: '1rem', backgroundColor: bgColor, borderRadius: '50%', cursor: 'pointer'}}>
      <RotateIconButton open={open} onClick={handleEventIcon} title='Mais opções'>
        <FontAwesomeIcon icon={faEllipsis} size='sm' color={`${textColor}`}/>
      </RotateIconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option, index) => (
            <MenuItem key={index} onClick={handleClose}>
            {option.icon} <span style={{ marginLeft: 8 }}>{option.label}</span>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default PlusOpt;