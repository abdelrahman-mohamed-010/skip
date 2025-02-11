import landing from "./landing";
import { imageGalleryType } from "./pagebuilder/imageGallery";
import { pageType } from "./pagebuilder/pageType";
import { navigationType } from "./pagebuilder/navigationType";
import { richTextType } from "./pagebuilder/richTextType";
import { contentSliderType } from "./pagebuilder/contentSlider";
import { pdfType } from "./pagebuilder/pdfType";
import blog from "./blog";
import news from "./news";
import guides from "./guides";
import footer from "./footer"; // added footer schema

export const schemaTypes = [
  landing,
  pageType,
  imageGalleryType,
  navigationType,
  richTextType,
  contentSliderType,
  pdfType,
  blog,
  news,
  guides,
  footer, // added footer schema
];
