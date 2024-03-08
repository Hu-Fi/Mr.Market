import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class SpotOrder {
  @PrimaryColumn()
  order_id: string;

  @Column()
  state: string;

  @Column()
  snapshot_id: string;

  @Column()
  created_at: string;
}
