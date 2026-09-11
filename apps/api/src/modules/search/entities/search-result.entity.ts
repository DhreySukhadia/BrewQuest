export class SearchResultEntity {
  id!: string;
  type!: 'coffee' | 'roaster' | 'flavour' | 'brew_log';
  title!: string;
  subtitle?: string;
  relevanceScore!: number;
}
