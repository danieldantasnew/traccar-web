import { map } from "../../map/core/MapView";
import dimensions from "../theme/dimensions";

export default function centerInMap(position, zoomLevel, isCoordinates = false) {
  const longitude = position.lng ? position.lng : position.longitude;
  const latitude = position.lat ? position.lat : position.latitude;
  
  map.easeTo({
    center: isCoordinates ? isCoordinates : [longitude, latitude],
    zoom: zoomLevel ? zoomLevel : 18,
    offset: [0, -dimensions.popupMapOffset / 2],
  });
}
