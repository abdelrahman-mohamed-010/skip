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
import { blockType } from "./pagebuilder/blockcomponent";
import { featuresType } from "./pagebuilder/features";
import { servicesType } from "./pagebuilder/services";
import { processType } from "./pagebuilder/process";
import landing from "./landing";
import hero from "./hero";
import { headerType } from "./pagebuilder/headerType";
import { finaleType } from "./pagebuilder/finaleType";
import { questionsType } from "./pagebuilder/questionsType";
import { sliderType } from "./pagebuilder/sliderType";
import pageListings from "./pageListings";

export const schemaTypes = [
  landing,
  hero,
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
  blockType,
  featuresType,
  servicesType,
  processType,
  headerType,
  finaleType,
  questionsType,
  sliderType,
  pageListings,
];
