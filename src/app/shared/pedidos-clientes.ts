export interface PedidosClientes {
  id: number;
  data: string;
  numberPedido: number;
  cliente: string;
  telefone: string;
  cep: string;
  cidade: string;
  rua: string;
  numCasa: string;
  bairro: string;
  complemento: string
  entrega_estimada: string;
  quantidade: number;
  descricao: string;
  total: number;
  valorFinal: number;
  pedidoRegistrado: boolean;
  pedidoPago: boolean;
  pedidoRetirado: boolean;
}
