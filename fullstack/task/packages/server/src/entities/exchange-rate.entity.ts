import { Field, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { INT, VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsNumber()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currencyCode!: string;

    @IsNumber()
    @Field(() => Number)
    @Column({ ...INT })
    public amount!: number;

    @IsNumber()
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    @Transform((value) => String(value.obj.rate))
    public rate!: string;
}
