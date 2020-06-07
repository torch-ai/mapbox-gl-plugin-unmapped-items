# Mapbox GL Unmapped Items

> Provides a flexible system for displaying a count as list with reasons of items that could not be added to the map.

# Usage

## Installation

Install the service in your own project

```
npm install @torch-ai/mapbox-gl-plugin-unmapped-items
```

## Initialization

### Global plugin options `utils/mapbox.ts`
```ts
import mapboxgl from "mapbox-gl";
import {
  IMapboxUnmappedItemsControl,
  MapboxUnmappedItemsControl,
} from "@torch-ai/mapbox-gl-plugin-unmapped-items";

// Create a function custom to your usage that will provide global icons and styles desired
export const addUnmappedControl = (
  map: mapboxgl.Map,
  items: any[] = [],
  options: IMapboxUnmappedItemsControl
): MapboxUnmappedItemsControl => {
  const defaultOptions: Partial<IMapboxUnmappedItemsControl> = {
    renderButton: async (count: number): Promise<HTMLElement> => {
      // Create an html element through static, web component, Vue, React, etc. 
      return document.createElement("span");
    },
    renderHeading: async (): Promise<HTMLElement> => {
      // Create an html element through static, web component, Vue, React, etc. 
      return document.createElement("span");
    },
  };

  const control = new MapboxUnmappedItemsControl(items, {
    ...defaultOptions,
    ...options,
  });
  map.addControl(control);
  return control;
};
```

### Local usage options `map-instance.ts`
```ts
import mapboxgl from "mapbox-gl";
import { addUnmappedControl } from "utils/mapbox";
const map = new mapboxgl.Map({
  container: mapContainer,
});
// Create an additional functions required to merge into the plugin
const drawUnmappedListItem = async (item: IFormattedNode): Promise<HTMLElement> => {
  const element = document.createElement("div");
  element.innerHTML = `
    <div class="font-weight-bold">${item.name} - ${item.relationDegree}-degree ${item.relationDetail}</div>
    <address>Address: ${item.address}</address>
  `;
  return element;
};
addUnmappedControl(map, [], {
  displayIfEmpty: true,
  renderItem: drawUnmappedListItem,
});
```

## License and agreements

This package is provided through an MIT license. Usage of this package is freely available without restriction.

Mapbox itself has its [own requirements](https://www.mapbox.com/legal/tos/). Please contact them for your account and terms.

## Installation

Clone the package from the [repository](https://github.com/torch-ai/mapbox-gl-plugin-unmapped-items).

```
npm install
```

## Testing

A local file `.env` file will need to be created with credentials for the api:

```text
API_KEY=****
```

You may run tests in a continuous watch mode:

```
npm run-script test:watch
```

## Publishing

Open an issue requesting a version to publish.
