/**
 * Este archivo fue generado automáticamente.
 * No lo edites manualmente, ejecuta execute_model.ts o npm run model para actualizarlo.
 */

import Client from '@/models/core/client.model';
import Device from '@/models/core/device.model';
import Fine from '@/models/core/fine.model';
import Model from '@/models/core/model.model';
import Payment from '@/models/core/payment.model';
import Sale from '@/models/core/sale.model';
import User from '@/models/core/user.model';
import Brand from '@/models/entities/brand.model';
import Role from '@/models/entities/role.model';
import Status from '@/models/entities/status.model';
import Fine_Client from '@/models/junctions/fine_client.model';
import Sale_Payment from '@/models/junctions/sale_payment.model';

const models = {
  Client,
  Device,
  Fine,
  Model,
  Payment,
  Sale,
  User,
  Brand,
  Role,
  Status,
  Fine_Client,
  Sale_Payment,
};

export default models;
