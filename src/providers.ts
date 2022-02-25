import { Container } from 'inversify';
import { AuthService } from './services/auth.service';
import { Database } from './database-config';
import { UserService } from './services/user.service';
import { MessagingService } from './services/messaging.service';

const ServicesCollection = new Container();

ServicesCollection.bind(Database).toSelf();

ServicesCollection.bind(AuthService).toSelf();
ServicesCollection.bind(UserService).toSelf();
ServicesCollection.bind(MessagingService).toSelf();

export { ServicesCollection };