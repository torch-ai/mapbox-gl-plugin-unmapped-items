import {
  IMapboxUnmappedItemsControl,
  MapboxUnmappedItemsControl,
} from "./plugin";

class MapboxUnmappedItemsControlTest extends MapboxUnmappedItemsControl {
  public container: HTMLElement | undefined;
  public buttonElement: HTMLButtonElement | undefined;
  public itemsElement: HTMLElement | undefined;

  public clickCount(): Promise<any> {
    return this.onCountClick();
  }
}

describe("unmapped plugin", () => {
  describe("options", () => {
    describe("defaults", () => {
      const defaultOptions: IMapboxUnmappedItemsControl = {
        renderButton: async () => document.createElement("span"),
        renderHeading: async () => document.createElement("span"),
        renderItemLoadingIndicator: async () => document.createElement("span"),
        renderItem: async () => document.createElement("span"),
      };

      const defaultRenderButtonSpy = jest.spyOn(defaultOptions, "renderButton");
      const defaultRenderHeadingSpy = jest.spyOn(
        defaultOptions,
        "renderHeading"
      );
      const defaultRenderLoadingIndicatorSpy = jest.spyOn(
        defaultOptions,
        "renderItemLoadingIndicator"
      );
      const defaultRenderItemSpy = jest.spyOn(defaultOptions, "renderItem");

      const items = [1, 2, 3, 4];
      const control = new MapboxUnmappedItemsControlTest(items, defaultOptions);
      control.container = document.createElement("div");
      control.itemsElement = document.createElement("div");
      control.buttonElement = document.createElement("button");

      it("should render a count of items in a button", async (done) => {
        await control.setItems(items);
        expect(defaultRenderButtonSpy).toBeCalledTimes(1);

        done();
      });

      it("should render details when clicked", async (done) => {
        await control.clickCount();
        expect(defaultRenderHeadingSpy).toBeCalledTimes(1);
        expect(defaultRenderLoadingIndicatorSpy).toBeCalledTimes(1);
        expect(defaultRenderItemSpy).toBeCalledTimes(items.length);

        done();
      });
    });

    describe("overrides", () => {
      const defaultOptions: IMapboxUnmappedItemsControl = {
        renderButton: async () => document.createElement("span"),
        renderHeading: async () => document.createElement("span"),
        renderItemLoadingIndicator: async () => document.createElement("span"),
        renderItem: async () => document.createElement("span"),
      };
      const defaultRenderButtonSpy = jest.spyOn(defaultOptions, "renderButton");
      const defaultRenderHeadingSpy = jest.spyOn(
        defaultOptions,
        "renderHeading"
      );
      const defaultRenderLoadingIndicatorSpy = jest.spyOn(
        defaultOptions,
        "renderItemLoadingIndicator"
      );
      const defaultRenderItemSpy = jest.spyOn(defaultOptions, "renderItem");

      const items = [1, 2, 3, 4];
      const control = new MapboxUnmappedItemsControlTest(items, defaultOptions);
      control.container = document.createElement("div");
      control.itemsElement = document.createElement("div");
      control.buttonElement = document.createElement("button");

      const options: IMapboxUnmappedItemsControl = {
        renderButton: async () => document.createElement("span"),
        renderHeading: async () => document.createElement("span"),
        renderItemLoadingIndicator: async () => document.createElement("span"),
        renderItem: async () => document.createElement("span"),
      };
      control.setOptions(options);

      const renderButtonSpy = jest.spyOn(options, "renderButton");
      const renderHeadingSpy = jest.spyOn(options, "renderHeading");
      const renderLoadingIndicatorSpy = jest.spyOn(
        options,
        "renderItemLoadingIndicator"
      );
      const renderItemSpy = jest.spyOn(options, "renderItem");
      control.setOptions(options);

      it("should render a count of items in a button", async (done) => {
        await control.setItems(items);
        expect(defaultRenderButtonSpy).toBeCalledTimes(0);
        expect(renderButtonSpy).toBeCalledTimes(1);

        done();
      });

      it("should render details when clicked", async (done) => {
        await control.clickCount();
        expect(defaultRenderHeadingSpy).toBeCalledTimes(0);
        expect(defaultRenderLoadingIndicatorSpy).toBeCalledTimes(0);
        expect(defaultRenderItemSpy).toBeCalledTimes(0);

        expect(renderHeadingSpy).toBeCalledTimes(1);
        expect(renderLoadingIndicatorSpy).toBeCalledTimes(1);
        expect(renderItemSpy).toBeCalledTimes(items.length);

        done();
      });
    });
  });
});
