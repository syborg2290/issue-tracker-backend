import { Module } from '@nestjs/common';
import { SessionRelationalRepository } from './repositories/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionAbstractRepository } from './repositories/session.abstract.repository';


@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionAbstractRepository,
      useClass: SessionRelationalRepository,
    },
  ],
  exports: [SessionAbstractRepository],
})
export class RelationalSessionPersistenceModule { }
