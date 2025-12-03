import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDirection } from '../entities/enums';

export class CategoryService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository(Category);
  }

  /**
   * קודם מחפש קטגוריה אישית של המשתמש, ואם אין – גלובלית (user=null)
   */
  async findByName(
    userId: number,
    name: string,
  ): Promise<Category | null> {
    const userCat = await this.repo.findOne({
      where: { user: { id: userId }, name },
    });
    if (userCat) return userCat;

    const globalCat = await this.repo.findOne({
      where: { user: null as any, name },
    });
    return globalCat ?? null;
  }

  /**
   * לוודא שקיימת קטגוריה – ואם לא, ליצור אחת למשתמש
   */
  async getOrCreateUserCategory(params: {
    userId: number;
    name: string;
    direction: CategoryDirection;
  }): Promise<Category> {
    const existing = await this.findByName(params.userId, params.name);
    if (existing) return existing;

    const cat = this.repo.create({
      user: { id: params.userId } as any,
      name: params.name,
      direction: params.direction,
      isSystem: false,
    });

    return this.repo.save(cat);
  }
}