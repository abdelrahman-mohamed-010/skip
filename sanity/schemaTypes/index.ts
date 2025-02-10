import footer from "./footer";
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

export const schemaTypes = [
  footer,
  landing,
  pageType,
  imageGalleryType,
  navigationType,
  richTextType,
  contentSliderType,
  pdfType,
  blog,
  news,
  guides
];
