import { PurchaseStatus } from '../constants/purchase-status.enum';

export class Purchase {
  constructor(
    public readonly id: string,
    public readonly date: string,
    public readonly tickets: string[],
    public readonly total: number,
    public readonly status: PurchaseStatus,
    public readonly createdAt: string,
  ) {}

  getStatusLabel(): string {
    const labels: Record<PurchaseStatus, string> = {
      [PurchaseStatus.PENDING]: 'Pendiente',
      [PurchaseStatus.VERIFIED]: 'Verificado',
      [PurchaseStatus.CANCELLED]: 'Cancelado',
      [PurchaseStatus.UNVERIFIED]: 'Sin verificar',
    };
    return labels[this.status];
  }

  getStatusVariant(): 'warning' | 'success' | 'danger' | 'default' {
    const variants: Record<PurchaseStatus, 'warning' | 'success' | 'danger' | 'default'> = {
      [PurchaseStatus.PENDING]: 'warning',
      [PurchaseStatus.VERIFIED]: 'success',
      [PurchaseStatus.CANCELLED]: 'danger',
      [PurchaseStatus.UNVERIFIED]: 'default',
    };
    return variants[this.status];
  }

  static fromApi(data: Record<string, unknown>): Purchase {
    return new Purchase(
      data.id as string,
      data.date as string,
      data.tickets as string[],
      data.total as number,
      data.status as PurchaseStatus,
      data.createdAt as string,
    );
  }
}
