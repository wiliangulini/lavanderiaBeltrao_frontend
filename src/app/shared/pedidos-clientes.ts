export interface PedidosClientes {
  id: number;
  data: string;
  numberPedido: string | number; // contrato: String; pedidos novos = "yyyyMMdd-NNN" (ADR 0007), gerado so no POST; legado preserva o numero antigo
  dataOperacional?: string; // ADR 0007: auxiliar, ISO "yyyy-MM-dd"; ausente em pedidos legados
  sequenciaDiaria?: number; // ADR 0007: auxiliar; ausente em pedidos legados
  cliente: string;
  telefone: string;
  cep: string;
  cidade: string;
  rua: string;
  numCasa: string;
  bairro: string;
  complemento: string;
  entrega_estimada?: string;
  quantidade: string;
  descricao: string;
  total: string | number; // contrato: BigDecimal (JSON numerico); form carrega string "12,50"
  retirada?: boolean;
  quantidade1: string;
  descricao1: string;
  total1: string | number;
  retirada1?: boolean;
  quantidade2: string;
  descricao2: string;
  total2: string | number;
  retirada2?: boolean;
  quantidade3: string;
  descricao3: string;
  total3: string | number;
  retirada3?: boolean;
  quantidade4: string;
  descricao4: string;
  total4: string | number;
  retirada4?: boolean;
  quantidade5: string;
  descricao5: string;
  total5: string | number;
  retirada5?: boolean;
  valorFinal: string | number; // contrato: BigDecimal (so na resposta; server calcula)
  pedidoRegistrado: boolean;
  pedidoPago: boolean;
  pedidoRetirado: boolean;
}
