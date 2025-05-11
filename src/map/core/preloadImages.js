import { loadImage, prepareIcon } from './mapUtil';
import pointSvg from '../../resources/images/point.svg';

export default async () => {
  const point = await loadImage(pointSvg);
  mapImages['point'] = await prepareIcon(point);
};
