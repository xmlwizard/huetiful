// @ts-check
import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

const frontmatter = {
  collection: "Functions for manipulating color token iterables.",
  generators: "Functions for making color scales and palettes.",
  wrappers: "Classes for method chaining.",
  accessibility: "Functions for handling color accessibility.",
  utils: "Functions for querying color tokens.",
  palettes: "Wrapper functions and objects for color maps.",
  types: "The type definitions used throughout the library.",
};

export function load(app) {
  app.renderer.on(
    MarkdownPageEvent.BEGIN,
    /** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
    (page) => {
      /**
       * Update page.frontmatter object using information from the page model
       *
       * Here if the page is a class, we set the title to the class name
       */

      page.frontmatter = {
        // e.g add a title
        title: page.model.name.charAt(0).toUpperCase() +
          page.model.name.slice(1),
        description: frontmatter[page.url.split(".")[0]],
      };
    },
  );
}
