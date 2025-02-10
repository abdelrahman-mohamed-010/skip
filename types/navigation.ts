export interface NavItem {
  itemType: "link" | "title";
  text: string;
  link?: string;
  subItems?: SubItem[];
}

export interface SubItem {
  text: string;
  link: string;
}

export interface NavigationData {
  title: string;
  items: NavItem[];
}
