// adapted from https://codesandbox.io/s/how-to-add-a-legend-to-the-map-using-react-leaflet-6yqs5?file=/src/Legend.js:1221-1227

import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function LeafletLegend({ getColor }) {

  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");
      const grades = [1, 0.5, 0];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="width: 18px;height: 18px;float: left;margin-right: 8px;opacity: 0.7;background:' + getColor(from) + '"></i> ' +
          (from * 100) +
          (to ? "&ndash;" + (to * 100) : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  }, [])
}
