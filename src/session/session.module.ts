import { Module } from '@nestjs/common';

import { DocumentSessionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { SessionService } from './session.service';

@Module({
  imports: [DocumentSessionPersistenceModule],
  providers: [SessionService],
  exports: [SessionService, DocumentSessionPersistenceModule],
})
export class SessionModule {}
