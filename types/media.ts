export interface MediaContent {
  _id?: string;
  title: string;
  description: string;
  type: "video" | "audio";
  category: string;
  categoryId?: string;
  thumbnail: string;
  filepath: string;
  published: boolean;
  views: number;
  likes: number;
  duration?: string;
  uploadDate?: string;
}
