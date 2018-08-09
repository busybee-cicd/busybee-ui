export class IpcMessageType {
  static readonly GET_DB_FILE = 'GET_DB_FILE';
  static readonly DB_FILE_READY = 'DB_FILE_READY';
  static readonly WRITE_DB_DATA = 'WRITE_DB_DATA';
  static readonly INIT_WS_CLIENT = 'INIT_WS_CLIENT';
  static readonly RUN_BUSYBEE_TEST = 'RUN_BUSYBEE_TEST';
  static readonly CANCEL_BUSYBEE_TEST = 'CANCEL_BUSYBEE_TEST';
  static readonly BUSYBEE_MSG = 'BUSYBEE_MSG';
  static readonly WS_CLIENT_ERROR = 'WS_CLIENT_ERROR';
}