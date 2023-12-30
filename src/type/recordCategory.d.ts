export interface IRecordCategoryResult {
  id: string;
  uid: string;
  url: null;
  type: string;
  href: string;
  tags: any[];
  first_publication_date: string;
  last_publication_date: string;
  slugs: string[];
  linked_documents: any[];
  alternate_languages: any[];
  data: IRecordCategory;
}
export interface IRecordCategory {
  title: Title[];
  question: any[];
  icon: Icon;
}

export interface Icon {
  dimensions: Dimensions;
  alt: null;
  copyright: null;
  url: string;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Title {
  type: string;
  text: string;
  spans: any[];
}
interface Authorization {
  code?: string;
  id_token: string;
  state?: string;
}

interface User {
  email: string;
  name?: {
    firstName: string;
    lastName: string;
  };
}

export interface IAppleResponse {
  authorization: Authorization;
  user: User;
}
