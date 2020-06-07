import mapboxgl, { IControl, Map as MapboxMap } from "mapbox-gl";
import "./index.css";

// TODO someday this should just be a plugin via NPM. Might do it myself
export interface IMapboxUnmappedItemsControl {
  renderButton?: (count: number) => Promise<HTMLElement>;
  renderHeading?: (items: any[]) => Promise<HTMLElement>;
  renderItemLoadingIndicator?: (items: any[]) => Promise<HTMLElement>;
  renderItem: (item: any) => Promise<HTMLElement>;
  displayIfEmpty?: boolean;
}

export class MapboxUnmappedItemsControl implements IControl {
  protected container: HTMLElement | undefined;
  protected buttonElement: HTMLButtonElement | undefined;
  protected itemsElement: HTMLElement | undefined;
  protected items: any[] = [];
  protected itemsRendered: boolean = false;
  protected itemsShowing: boolean = false;
  protected options: IMapboxUnmappedItemsControl = {
    async renderButton(count: number): Promise<HTMLElement> {
      const element = document.createElement("span");
      element.innerHTML = `${count.toLocaleString()}`;
      return element;
    },
    async renderHeading(): Promise<HTMLElement> {
      const element = document.createElement("h3");
      element.innerHTML = `Items that could not be mapped:`;
      return element;
    },
    async renderItemLoadingIndicator(): Promise<HTMLElement> {
      return document.createElement("progress");
    },
    // A prototype example. This doesn't actually get called in TS implementations.
    async renderItem(item: any): Promise<HTMLElement> {
      const element = document.createElement("div");
      element.innerHTML = `<pre>${JSON.stringify(item)}</pre>`;
      return element;
    },
    displayIfEmpty: true,
  };

  constructor(items: any[], options: IMapboxUnmappedItemsControl) {
    this.setOptions(options);
    this.setItems(items);
  }

  public async setItems(items: any[]) {
    this.items = items;
    this.itemsRendered = false;
    if (this.container) {
      return this.render();
    }
  }

  public setOptions(options: IMapboxUnmappedItemsControl) {
    this.options = { ...this.options, ...options };
  }

  public getDefaultPosition(): mapboxgl.Anchor {
    return "top-left";
  }

  public onAdd(map: MapboxMap): HTMLElement {
    this.container = document.createElement("aside");
    this.container.classList.add("mapboxgl-ctrl");
    this.container.classList.add("mapboxgl-ctrl-group");
    this.container.classList.add("mapboxgl-unmapped-ctrl");

    this.buttonElement = document.createElement("button");
    this.buttonElement.classList.add("mapboxgl-unmapped-items-counter");
    this.buttonElement.addEventListener("click", this.onCountClick.bind(this));
    this.container.append(this.buttonElement);
    document.addEventListener("click", this.onDocumentClick.bind(this));

    this.itemsElement = document.createElement("div");
    this.itemsElement.classList.add("mapboxgl-unmapped-items-elements");
    this.container.append(this.itemsElement);

    this.render();
    return this.container;
  }

  protected async onCountClick() {
    if (this.itemsShowing) {
      return this.hideItems();
    }

    if (this.itemsRendered) {
      return this.showItems();
    }

    this.showItems();
    await this.renderItems();
  }

  protected onDocumentClick(event: Event) {
    if (!this.container) {
      return;
    }

    if (!this.container.contains(event.target as Element)) {
      this.hideItems();
    }
  }

  protected showItems() {
    this.container!.classList.add("mapboxgl-unmapped-ctrl--open");
    this.buttonElement!.classList.remove(
      "mapboxgl-unmapped-items-counter--show"
    );
    this.itemsElement!.classList.add("mapboxgl-unmapped-items-elements--show");
    this.itemsShowing = true;
  }

  protected hideItems() {
    this.container!.classList.remove("mapboxgl-unmapped-ctrl--open");
    this.buttonElement!.classList.add("mapboxgl-unmapped-items-counter--show");
    this.itemsElement!.classList.remove(
      "mapboxgl-unmapped-items-elements--show"
    );
    this.itemsShowing = false;
  }

  protected async render() {
    if (!this.container || !this.itemsElement || !this.buttonElement) {
      throw new Error("Elements are not defined");
    }

    this.container.classList.remove("mapboxgl-unmapped-ctrl--show");
    this.buttonElement.innerHTML = "";
    this.itemsElement.innerHTML = "";
    this.itemsElement.classList.remove(
      "mapboxgl-unmapped-items-elements--show"
    );
    this.hideItems();

    if (!this.items && !this.options.displayIfEmpty) {
      return;
    }

    await this.renderCount();
    this.container.classList.add("mapboxgl-unmapped-ctrl--show");
  }

  protected async renderCount() {
    if (!this.options.renderButton) {
      throw new Error("renderButton is not defined");
    }

    const countElement = await this.options.renderButton(this.items.length);
    this.buttonElement!.append(countElement);
    this.buttonElement!.classList.add("mapboxgl-unmapped-items-counter--show");
    return this.buttonElement;
  }

  protected async renderItems() {
    if (!this.itemsElement) {
      throw new Error("Items element is not defined");
    }
    if (!this.options.renderItemLoadingIndicator) {
      throw new Error("renderItemLoadingIndicator is not defined");
    }
    if (!this.options.renderHeading) {
      throw new Error("renderHeading is not defined");
    }
    if (!this.options.renderItem) {
      throw new Error("renderItem is not defined");
    }

    const loadingElement = await this.options.renderItemLoadingIndicator(
      this.items
    );
    this.itemsElement.append(loadingElement);

    const itemElementPromises = this.items.map(this.options.renderItem);
    const itemElements = await Promise.all(itemElementPromises);

    this.itemsElement.innerHTML = "";
    const heading = await this.options.renderHeading(this.items);
    heading.classList.add("mapboxgl-unmapped-items-heading");
    this.itemsElement.append(heading);
    itemElements.forEach((element) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("mapboxgl-unmapped-items-element");
      itemElement.append(element);
      this.itemsElement!.append(itemElement);
    });
    this.itemsRendered = true;
  }

  public onRemove(): void {
    return;
  }
}
