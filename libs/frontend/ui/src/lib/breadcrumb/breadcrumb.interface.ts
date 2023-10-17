export interface IBreadCrumb {
  label: string;
  link: string[];
  queryParams?: { [key: string ]: string };
}
