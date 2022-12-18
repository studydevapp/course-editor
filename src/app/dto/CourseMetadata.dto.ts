export interface CourseMetadataText {
  title: string;
  description: string;
  tasks: {
    title: string;
    content: string;
  }[];
}

export interface CourseMetadataDto {
  active: boolean;
  slug: string;
  topic: string;
  reward: number;
  difficulty: number;
  plan: string; // internal name of this plan
  request_features: ('db_postgres')[];
  text: {
    en: CourseMetadataText;
    de: CourseMetadataText;
  };
  is_challenge: boolean;
}
