import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn()
  asset_id: string;

  @Column()
  symbol: string;

  @ManyToMany(() => Exchange, (exchange) => exchange.tokens)
  @JoinTable({
    name: 'token_exchange',
    joinColumn: { name: 'token_id', referencedColumnName: 'asset_id' },
    inverseJoinColumn: { name: 'exchange_id', referencedColumnName: 'name' },
  })
  exchanges: Exchange[];
}

@Entity()
export class Exchange {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Token, (token) => token.exchanges)
  tokens: Token[];
}

@Entity('token_exchange')
export class TokenExchange {
  @PrimaryColumn()
  token_id: string;

  @PrimaryColumn()
  exchange_id: string;

  @ManyToOne(() => Token, (token) => token.exchanges)
  @JoinColumn({ name: 'token_id', referencedColumnName: 'asset_id' }) // Correctly reference the join column
  token: Token;

  @ManyToOne(() => Exchange, (exchange) => exchange.tokens)
  @JoinColumn({ name: 'exchange_id', referencedColumnName: 'name' }) // Correctly reference the join column
  exchange: Exchange;

  @Column()
  minimumBalance: string;
}
@Entity()
export class RebalanceHistory {
  // @PrimaryGeneratedColumn()
}
