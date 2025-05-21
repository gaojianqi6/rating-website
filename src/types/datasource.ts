export interface DataSource {
  id: number;
  name: string;
  sourceType: string;
  configuration: any;
  options: DataSourceOption[];
}

export interface DataSourceOption {
  id: number;
  dataSourceId: number;
  value: string;
  displayText: string;
}