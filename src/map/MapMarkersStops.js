import { useEffect } from "react";
import { map } from "./core/MapView";
import { findFonts } from "./core/mapUtil";
import dimensions from "../common/theme/dimensions";
import centerInMap from "../common/util/centerInMap";

const MapMarkersStops = ({ markers, setStopCard }) => {
  const sourceId = "stops-layer";

  const handleClick = (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    if (feature.properties.point_count) {
      const clusterId = feature.properties.cluster_id;
      const source = map.getSource(sourceId);
      if (!source) return;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        centerInMap(feature.geometry.coordinates, zoom, true);
      });
    } else {
      setStopCard(feature.properties);
      centerInMap(feature.properties, 16)
    }
  };

  useEffect(() => {
    if (!map) return;

    if (!markers || markers.length === 0) {
      if (map.getLayer(`${sourceId}-cluster-circle`)) {
        map.removeLayer(`${sourceId}-cluster-circle`);
      }
      if (map.getLayer(`${sourceId}-cluster-count`)) {
        map.removeLayer(`${sourceId}-cluster-count`);
      }
      if (map.getLayer(`${sourceId}-unclustered-circle`)) {
        map.removeLayer(`${sourceId}-unclustered-circle`);
      }
      if (map.getLayer(`${sourceId}-unclustered`)) {
        map.removeLayer(`${sourceId}-unclustered`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      return;
    }

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterMaxZoom: 17,
        clusterRadius: 24,
      });

      map.addLayer({
        id: `${sourceId}-cluster-circle`,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#000",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            10,
            30,
            30,
            40,
          ],
          "circle-opacity": 1,
          "circle-stroke-width": 1.6,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: `${sourceId}-cluster-count`,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": findFonts(map),
          "text-size": 16,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: `${sourceId}-unclustered-circle`,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "background"],
          "circle-radius": 14,
          "circle-opacity": 1,
          "circle-stroke-width": 1.6,
          "circle-stroke-color": ["get", "text"],
        },
      });

      map.addLayer({
        id: `${sourceId}-unclustered`,
        type: "symbol",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": "{stopped}",
          "text-size": 16,
          "text-font": findFonts(map),
          "text-allow-overlap": true,
          "text-anchor": "center",
        },
        paint: {
          "text-halo-width": 2,
          "text-color": ["get", "text"],
        },
      });

      map.on("click", `${sourceId}-cluster-circle`, handleClick);
      map.on("click", `${sourceId}-cluster-count`, handleClick);
      map.on("click", `${sourceId}-unclustered-circle`, handleClick);
      map.on("click", `${sourceId}-unclustered`, handleClick);
    }
  }, [markers, map, sourceId, setStopCard]);

  useEffect(() => {
    if (!map || !map.getSource(sourceId)) return;

    const features = markers.map(({
      model,
      sat,
      ignition,
      odometer,
      accuracy,
      attributes,
      latitude,
      longitude,
      stopped,
      background,
      text,
      secondary,
      address,
      averageSpeed,
      deviceId,
      deviceName,
      duration,
      endTime,
      startTime,
    }) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        model,
        sat,
        ignition,
        odometer,
        accuracy,
        attributes,
        latitude,
        longitude,
        stopped,
        background,
        text,
        secondary,
        address,
        averageSpeed,
        deviceId,
        deviceName,
        duration,
        endTime,
        startTime,
      },
    }));

    map.getSource(sourceId).setData({
      type: "FeatureCollection",
      features,
    });
  }, [markers, map, sourceId]);

  useEffect(() => {
    const moveLayersToTop = () => {
      if (map.getLayer(`${sourceId}-unclustered-circle`)) {
        map.moveLayer(`${sourceId}-unclustered-circle`);
      }
      if (map.getLayer(`${sourceId}-unclustered`)) {
        map.moveLayer(`${sourceId}-unclustered`);
      }
      if (map.getLayer(`${sourceId}-cluster-circle`)) {
        map.moveLayer(`${sourceId}-cluster-circle`);
      }
      if (map.getLayer(`${sourceId}-cluster-count`)) {
        map.moveLayer(`${sourceId}-cluster-count`);
      }
    };

    moveLayersToTop();
    map.on("styledata", moveLayersToTop);
    return () => {
      map.off("styledata", moveLayersToTop);
    };
  }, [map, sourceId]);

  useEffect(() => {
    return () => {
      if (!map) return;
      if (map.getLayer(`${sourceId}-cluster-circle`)) {
        map.removeLayer(`${sourceId}-cluster-circle`);
      }
      if (map.getLayer(`${sourceId}-cluster-count`)) {
        map.removeLayer(`${sourceId}-cluster-count`);
      }
      if (map.getLayer(`${sourceId}-unclustered-circle`)) {
        map.removeLayer(`${sourceId}-unclustered-circle`);
      }
      if (map.getLayer(`${sourceId}-unclustered`)) {
        map.removeLayer(`${sourceId}-unclustered`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, sourceId]);

  return null;
};

export default MapMarkersStops;