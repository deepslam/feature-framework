import { ErrorTypeEnum } from '../../Types';
import Event from '../../Models/Event';

export default class AppErrorEvent extends Event<{
  message: string;
  type: ErrorTypeEnum;
}> {}
