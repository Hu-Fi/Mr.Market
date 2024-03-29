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
export class RebalanceToken {
  @PrimaryColumn()
  asset_id: string;

  @Column()
  symbol: string;

  @ManyToMany(() => RebalanceExchange, (exchange) => exchange.tokens)
  @JoinTable({
    name: 'token_exchange',
    joinColumn: { name: 'token_id', referencedColumnName: 'asset_id' },
    inverseJoinColumn: { name: 'exchange_id', referencedColumnName: 'name' },
  })
  exchanges: RebalanceExchange[];
}

@Entity()
export class RebalanceExchange {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => RebalanceToken, (token) => token.exchanges)
  tokens: RebalanceToken[];
}

@Entity()
export class RebalanceTokenExchange {
  @PrimaryColumn()
  token_id: string;

  @PrimaryColumn()
  exchange_id: string;

  @ManyToOne(() => RebalanceToken, (token) => token.exchanges)
  @JoinColumn({ name: 'token_id', referencedColumnName: 'asset_id' })
  token: RebalanceToken;

  @ManyToOne(() => RebalanceExchange, (exchange) => exchange.tokens)
  @JoinColumn({ name: 'exchange_id', referencedColumnName: 'name' })
  exchange: RebalanceExchange;

  @Column()
  minimumBalance: string;
}
@Entity()
export class RebalanceHistory {
  @PrimaryColumn()
  trace_id: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  api_key_id: string;

  @Column()
  exchange_id: string;

  @Column()
  amount: string;

  @Column()
  fee: string;

  @Column()
  timestamp: string;
}
