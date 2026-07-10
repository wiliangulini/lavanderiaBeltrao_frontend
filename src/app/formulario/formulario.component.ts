import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
import {HttpClient} from "@angular/common/http";
import {DataCrudService} from "../shared/services/data-crud.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormCadastroComponent} from "../form-cadastro/form-cadastro.component";
import * as printJS from 'print-js';
import {empty} from "rxjs";


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormularioComponent extends FormCadastroComponent implements OnInit, AfterViewInit, OnChanges, ChangeDetectorRef {
  checkNoChanges(): void {}
  detach(): void {}
  detectChanges(): void {}
  markForCheck(): void {}
  reattach(): void {}

  @Input() numberPedido: any;
  @Input() pedidosClientes: any = {};
  @ViewChild('pedidoNum') pedidoNum: any;
  @Input() arrPedidos: any = [];
  // PesquisaComponent estende FormularioComponent (herda arrPedidos/searchPedido
  // com seu proprio estado) e AINDA ASSIM embute <app-formulario> como filho
  // separado para o formulario de edicao - quem salva de fato eh o filho, mas
  // quem renderiza a lista visivel eh o pai. Emitir aqui e o pai escutar
  // (pedidoEditado)="searchPedido()" e como a lista do pai fica sincronizada.
  @Output() pedidoEditado = new EventEmitter<void>();

  vf: any = [];
  pedido: any = [];
  d: number = 0;
  classField: any;
  test: any;

  // Visibilidade de cada slot extra (product1..product5) - indice 0..4 = slot 1..5.
  // Substitui o antigo indice unico (this.i) usado como pilha, que ficava
  // dessincronizado sempre que onEdit() revelava slots direto no DOM sem
  // atualizar this.i (causa raiz do bug "precisa adicionar antes de excluir").
  slotsVisiveis: boolean[] = [false, false, false, false, false];

  constructor(
    protected fb: FormBuilder,
    protected http: HttpClient,
    CS: DataCrudService,
    CP: ConsultaCepService,
    protected _snackBar: MatSnackBar,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(CS, CP);
    this.formulario = this.fb.group({
      search: [],
      data: [null, [Validators.required]],
      numberPedido: [null, [Validators.required]],
      cliente: [null, [Validators.required]],
      telefone: [null, [Validators.required]],
      cep: [],
      cidade: [],
      rua: [],
      numCasa: [],
      bairro: [],
      complemento: [],
      entrega_estimada: [],
      quantidade: [],
      descricao: [null, [Validators.required]],
      total: [],
      retirada: [],
      quantidade1: [],
      descricao1: [],
      total1: [],
      retirada1: [],
      quantidade2: [],
      descricao2: [],
      total2: [],
      retirada2: [],
      quantidade3: [],
      descricao3: [],
      total3: [],
      retirada3: [],
      quantidade4: [],
      descricao4: [],
      total4: [],
      retirada4: [],
      quantidade5: [],
      descricao5: [],
      total5: [],
      retirada5: [],
      valorFinal: [],
      pedidoRegistrado: [],
      pedidoPago: [],
      pedidoRetirado: [],
      textarea: [],
    });
  }

  // REMOVIDO: ngAfterViewChecked() causava change detection excessivo
  // ngAfterViewChecked(): void {
  //   this.changeDetectorRef.detectChanges();
  // }

  override  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // setTimeout(0): adia estas mutacoes para depois do primeiro ciclo de
    // change detection. Sem isso, setValue()/atribuicoes sincronas aqui
    // disparam NG0100 (ExpressionChangedAfterItHasBeenCheckedError), pois
    // mudam valores lidos no template (via formControlName/ngModel) no
    // mesmo ciclo em que o Angular acabou de checa-los.
    setTimeout(() => {
      let pes = document.getElementById('pesquisa');

      pes ? this.formulario.get('numberPedido')?.setValue('') : this.numPedido();
      pes ? this.submitted = false : this.submitted = true;
      !pes ? this.formulario.get('pedidoRegistrado')?.setValue(true) : this.formulario.get('pedidoRegistrado')?.setValue(false);

      let url = window.location.hash.slice(2);
      console.log(url);
      let imprimir: any = document.querySelector('#imprimir');
      url === 'registrar-pedido' ? imprimir.classList.add('d-none') : imprimir.classList.remove('d-none') ;
    });
  }

  numPedido() {
    // OTIMIZADO: Usa endpoint dedicado que retorna apenas o próximo número
    this.crudService.getNextPedidoNumber().subscribe((nextNumber: number) => {
      this.np = nextNumber;
      this.formulario.get('numberPedido')?.setValue(this.np);
    });
  }

  searchPedido() {
    // OTIMIZADO: Usa endpoint de busca server-side
    const query = this.formulario.get('search')?.value;
    if (!query || query.trim().length === 0) {
      this.arrPedidos = [];
      return;
    }

    this.crudService.searchPedidos(query.trim()).subscribe((data: any[]) => {
      this.arrPedidos = data;
    });
  }

  onEdit(id: any) {
    this.crudService.findById(id).subscribe((data) => {
      // A revelacao dos slots (product1..product5) NAO acontece mais aqui.
      // onEdit() roda nesta instancia (o pai, PesquisaComponent/PedidosComponent,
      // que estende FormularioComponent), mas quem renderiza os campos e
      // botoes de item e o <app-formulario> FILHO, com seu proprio
      // slotsVisiveis - mostrarSlot() chamado aqui so mexeria no array desta
      // instancia, nao no do filho, dessincronizando os dois (bug real
      // observado). ngOnChanges() abaixo reage a mudanca de pedidosClientes
      // e roda na instancia que de fato recebe o @Input (o filho).
      this.pedidosClientes = data;
      console.log(this.pedidosClientes)
      let pedido: any = Object.entries(data);
      for (let i = 0; i < pedido.length; i++) {
        if(pedido[i][0].includes("total") && pedido[i][1] != null) {
          pedido[i][1] = pedido[i][1] + '';
          pedido[i][0] === "total" ? this.pedidosClientes.total = pedido[i][1].replace(".", ",") : null;
          pedido[i][0] === "total1" ? this.pedidosClientes.total1 = pedido[i][1].replace(".", ",") : null;
          pedido[i][0] === "total2" ? this.pedidosClientes.total2 = pedido[i][1].replace(".", ",") : null;
          pedido[i][0] === "total3" ? this.pedidosClientes.total3 = pedido[i][1].replace(".", ",") : null;
          pedido[i][0] === "total4" ? this.pedidosClientes.total4 = pedido[i][1].replace(".", ",") : null;
          pedido[i][0] === "total5" ? this.pedidosClientes.total5 = pedido[i][1].replace(".", ",") : null;
        }
        if(pedido[i][0] === 'valorFinal') {
          pedido[i][1] = pedido[i][1] + '';
          this.pedidosClientes.valorFinal = pedido[i][1].replace(".", ",");
        }
      }
      // Sincroniza a propria instancia tambem (cobre o caso de <app-formulario>
      // ser usado sozinho, sem pai, onde ngOnChanges nao teria uma mudanca de
      // @Input de fato vinda de fora para reagir).
      this.sincronizarSlotsVisiveis();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pedidosClientes']) {
      this.sincronizarSlotsVisiveis();
    }
  }

  // Deriva quais slots (1..5) devem estar visiveis a partir de
  // pedidosClientes.totalN - chamado tanto por ngOnChanges (quando o @Input
  // muda, caso do <app-formulario> filho) quanto por onEdit (caso de uso
  // direto, sem pai).
  private sincronizarSlotsVisiveis(): void {
    this.ocultarTodosSlots();
    if (!this.pedidosClientes) return;
    for (let n = 1; n <= 5; n++) {
      if (this.pedidosClientes['total' + n] != null) {
        this.mostrarSlot(n);
      }
    }
  }

  onRemove(id: any) {
    this.crudService.remove(id).subscribe(() => {
      this._snackBar.open('PEDIDO REMOVIDO COM SUCESSO!!!', '', {duration: 4000})
      this.formulario.get('search');
      this.searchPedido();
    });
  }

  consultarCliente(event: any) {
    // OTIMIZADO: Usa endpoint de busca server-side
    const cliente = event.target?.value;
    if (!cliente || cliente.trim().length < 3) {
      return;
    }

    this.crudService.searchClientes(cliente.trim()).subscribe((data: any[]) => {
      if (data && data.length > 0 && this.pedidosClientes.pedidoRegistrado) {
        const match = data[0]; // Pega o primeiro resultado
        this.pedidosClientes = match;
        this.formulario.get('pedidoRegistrado')?.setValue(true);
        console.log(this.pedidosClientes);
      }
    });
  }

  loopForTotais(valor: any, pedido: any, ) {
    valor = [];
    for (let i = 0; i < pedido.length; i++) {
      if(pedido[i][0].includes("total") && pedido[i][1] != null) {
        pedido[i][1] = pedido[i][1] + '';
        pedido[i][1] = parseFloat(pedido[i][1].replace(",", "."));
        pedido[i][1] =  parseFloat(pedido[i][1].toFixed(2));
        pedido[i][0] === "total" ? valor.push(this.pedidosClientes.total = pedido[i][1])  : null;
        pedido[i][0] === "total1" ? valor.push(this.pedidosClientes.total1 = pedido[i][1]) : null;
        pedido[i][0] === "total2" ? valor.push(this.pedidosClientes.total2 = pedido[i][1]) : null;
        pedido[i][0] === "total3" ? valor.push(this.pedidosClientes.total3 = pedido[i][1]) : null;
        pedido[i][0] === "total4" ? valor.push(this.pedidosClientes.total4 = pedido[i][1]) : null;
        pedido[i][0] === "total5" ? valor.push(this.pedidosClientes.total5 = pedido[i][1]) : null;
      }
    }
    return valor;
  }

  onChange(): void {
    let total = 0;
    let valorFinal: any;
    let valf: any = []
    this.pedido = Object.entries(this.pedidosClientes);
    valf = this.loopForTotais(valf, this.pedido);

    for(let i=0; i<valf.length; i++) {
      total += valf[i];
    }
    valorFinal = total.toFixed(2).replace(".", ",");
    this.formulario.get("valorFinal")?.setValue(valorFinal);
  }

  formatarMoeda(e: any): void {
    console.log(e)
    e.target.value = e.target.value + "";
    let v = e.target.value.replace(/\D/g,"");
    v = (v/100).toFixed(2) + "";
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    console.log(e)
    let campo = e.target.id;
    this.formulario.get(campo)?.setValue(v);
  }

  pesarRetirada(e: any) {
    let valor: any = e.target.checked;
    let _iden: any = e.target.id;
    this.formulario.get(_iden)?.setValue(valor);
    switch (_iden) {
      case 'retirada':
        this.formulario.get('total')?.setValue(0);
        this.onChange();
        break;
      case 'retirada1':
        this.formulario.get('total1')?.setValue(0);
        this.onChange();
        break;
      case 'retirada2':
        this.formulario.get('total2')?.setValue(0);
        this.onChange();
        break;
      case 'retirada3':
        this.formulario.get('total3')?.setValue(0);
        this.onChange();
        break;
      case 'retirada4':
        this.formulario.get('total4')?.setValue(0);
        this.onChange();
        break;
      case 'retirada5':
        this.formulario.get('total5')?.setValue(0);
        this.onChange();
        break;
    }
  }

  // Botao global "adicionar": revela o slot seguinte ao maior slot ja
  // visivel - sempre no final da lista, mesmo que exista um slot vazio no
  // meio (ex.: item do meio removido antes) - preencher esse buraco em vez
  // de ir ao final faria o item novo aparecer visualmente entre itens ja
  // existentes, na posicao fixa do slot no template.
  novoCampo() {
    let maiorVisivel = 0;
    for (let n = 1; n <= 5; n++) {
      if (this.slotsVisiveis[n - 1]) maiorVisivel = n;
    }
    let proximo = maiorVisivel + 1;
    if (proximo > 5) {
      this._snackBar.open('NÃO SAO PERMITIDOS MAIS CAMPOS!!!', '', {duration: 5000});
      return;
    }
    this.mostrarSlot(proximo);
  }

  // Botao de excluir de um item especifico (slot n, 1..5) - chamado pelo
  // proprio bloco do item no template, nao depende de indice compartilhado.
  removerItem(n: number): void {
    if (n < 1 || n > 5) return;
    let getT = this.formulario.get('total' + n);
    let getQ = this.formulario.get('quantidade' + n);
    let getD = this.formulario.get('descricao' + n);
    if (getT?.value !== null || getQ?.value !== null || getD?.value !== null) {
      getT?.setValue(null);
      getQ?.setValue('');
      getD?.setValue('');
      this.onChange();
    }
    this.slotsVisiveis[n - 1] = false;
    let el = document.querySelector('.product' + n);
    el?.classList.remove('add');
    el?.classList.add('remove');
  }

  mostrarSlot(n: number): void {
    if (n < 1 || n > 5) return;
    this.slotsVisiveis[n - 1] = true;
    let el = document.querySelector('.product' + n);
    el?.classList.remove('remove');
    el?.classList.add('add');
  }

  // So esconde (usado ao trocar de pedido em edicao ou ao resetar o
  // formulario) - nao limpa valor de campo, quem chama decide se precisa.
  private ocultarTodosSlots(): void {
    for (let n = 1; n <= 5; n++) {
      this.slotsVisiveis[n - 1] = false;
      let el = document.querySelector('.product' + n);
      el?.classList.remove('add');
      el?.classList.add('remove');
    }
  }

  msg: any;

  enviarPedidoCliente(pedido: any) {
    // falta pegar numero de pecas e t de cada uma delas e o valor final
    let t = 0;
    let total: any;
    let pedidoApiWhats: any = Object.entries(pedido);
    let ds: any = [];
    let qt: any = [];
    let register: any = [];
    let pag: any = [];
    let retirado: any = [];
    let status: any;
    let totais: any = [];
    let newmsg: any = [];
    let pesagem: any = [];
    let entrega_estimada: any = [];
    let msg: any;
    let msgEncode: any;
    let urlApi = "https://web.whatsapp.com/send";
    let celular: any = pedido.telefone;
    //apenas numeros
    celular = celular.replace(/\D/g,'');
    //verificar ddi, add se n tiver;
    if(celular.length < 13){
      celular = "55" + celular;
    }
    totais = this.loopForTotais(totais, pedidoApiWhats);

    for(let i=0; i<totais.length; i++) t += totais[i];

    total = t.toFixed(2).replace(".", ",");
    for (let i = 0; i < pedidoApiWhats.length; i++) {
      if(pedidoApiWhats[i][0].includes("descricao") && pedidoApiWhats[i][1] !== null) ds.push(pedidoApiWhats[i][1]);
      if(pedidoApiWhats[i][0].includes("quantidade") && pedidoApiWhats[i][1] !== null) qt.push(pedidoApiWhats[i][1]);
      if(pedidoApiWhats[i][0].includes("pedidoRegistrado") && pedidoApiWhats[i][1] !== null) register.push(pedidoApiWhats[i][1]);
      if(pedidoApiWhats[i][0].includes("pedidoPago") && pedidoApiWhats[i][1] !== null) pag.push(pedidoApiWhats[i][1]);
      if(pedidoApiWhats[i][0].includes("pedidoRetirado") && pedidoApiWhats[i][1] !== null) retirado.push(pedidoApiWhats[i][1]);
      if(pedidoApiWhats[i][0].includes("retirada") && pedidoApiWhats[i][1] !== null) pesagem.push(pedidoApiWhats[i][1]);
      if(pedidoApiWhats[i][0].includes("entrega_estimada") && pedidoApiWhats[i][1] !== null) entrega_estimada.push(pedidoApiWhats[i][1]);
    }

    for(let i=0; i<ds.length; i++) {
      if(pesagem[i] && totais[i] === 0) {
        newmsg += "\n" + qt[i] + " " + ds[i] + " = " + "R$ " + totais[i].toFixed(2).replace(".", ",")+'** pesagem na retirada, valor final irá mudar';
      } else {
        newmsg += "\n" + qt[i] + " " + ds[i] + " = " + "R$ " + totais[i].toFixed(2).replace(".", ",");
      }
    }
    console.log(newmsg)

    if(register[0] && pag[0] && retirado[0]) {
      status = 'Pedido Registrado, Pago e Retirado pelo cliente;';
    } else if(register[0] && pag[0]) {
      status = 'Pedido Registrado e Pago;';
    } else if(register[0]) {
      status = 'Pedido Registrado;';
    } else if(pag[0]) {
      status = 'Pedido Pago;';
    }

    msg = "Lavanderia Beltrão.\n\nCliente: " + pedido.cliente +";"+ "\nNúmero do pedido: #" + pedido.numberPedido + "\n\nDescrição do pedido: " + '\n' + newmsg + "\n\nEstimativa de Entrega: " + entrega_estimada +";" + "\n\nTotal: R$ " + total + "\n\nStatus: " + status + "\n\nObs: não seguramos mercadoria mais de 60 dias!!!";
    msgEncode = window.encodeURIComponent(msg);
    if(this.mobileCheck()){
      urlApi = "https://api.whatsapp.com/send";
    }
    window.open(urlApi + "?phone=" + celular + "&text=" + msgEncode);
  }

  imprimir(pedido: any) {
    console.log(pedido)
    let t = 0;
    let total: any;
    let pedidoImpresso: any = Object.entries(pedido);
    console.log(pedidoImpresso)
    let ds: any = [];
    let qt: any = [];
    let register: any = [];
    let pag: any = [];
    let retirado: any = [];
    let status: any;
    let totais: any = [];
    let newmsg: any = [];
    let pesagem: any = [];
    let entrega_estimada: any = [];
    let celular: any = pedido.telefone;
    //apenas numeros
    celular = celular!.replace(/\D/g,'');
    //verificar ddi, add se n tiver;
    if(celular.length < 13) celular = "55" + celular;
    console.log(celular);
    totais = this.loopForTotais(totais, pedidoImpresso);

    for(let i=0; i<totais.length; i++) t += totais[i];

    total = t.toFixed(2).replace(".", ",");
    for (let i = 0; i < pedidoImpresso.length; i++) {
      if(pedidoImpresso[i][0].includes("descricao") && pedidoImpresso[i][1] !== null) ds.push(pedidoImpresso[i][1]);
      if(pedidoImpresso[i][0].includes("quantidade") && pedidoImpresso[i][1] !== null) qt.push(pedidoImpresso[i][1]);
      if(pedidoImpresso[i][0].includes("pedidoRegistrado") && pedidoImpresso[i][1] !== null) register.push(pedidoImpresso[i][1]);
      if(pedidoImpresso[i][0].includes("pedidoPago") && pedidoImpresso[i][1] !== null) pag.push(pedidoImpresso[i][1]);
      if(pedidoImpresso[i][0].includes("pedidoRetirado") && pedidoImpresso[i][1] !== null) retirado.push(pedidoImpresso[i][1]);
      if(pedidoImpresso[i][0].includes("retirada") && pedidoImpresso[i][1] !== null) pesagem.push(pedidoImpresso[i][1]);
      if(pedidoImpresso[i][0].includes("entrega_estimada") && pedidoImpresso[i][1] !== null) entrega_estimada.push(pedidoImpresso[i][1]);
    }

    for(let i=0; i<ds.length; i++) {
      if(pesagem[i] && totais[i] === 0) {
        newmsg += "\n" + qt[i] + " " + ds[i] + " = " + "R$ " + totais[i].toFixed(2).replace(".", ",")+'** pesagem na retirada, valor final irá mudar';
      } else {
        newmsg += "\n" + qt[i] + " " + ds[i] + " = " + "R$ " + totais[i].toFixed(2).replace(".", ",");
      }
    }
    console.log(newmsg)

    if(register[0] && pag[0] && retirado[0]) {
      status = 'Pedido Registrado, Pago e Retirado pelo cliente;';
    } else if(register[0] && pag[0]) {
      status = 'Pedido Registrado e Pago;';
    } else if(register[0]) {
      status = 'Pedido Registrado;';
    } else if(pag[0]) {
      status = 'Pedido Pago;';
    }

    let textarea: any = document.querySelector('#printJS-form');
    textarea.classList.add('d-flex');
    textarea.classList.remove('d-none');
    console.log(textarea)

    this.msg = "Lavanderia Beltrão.\n\nCliente: " + pedido.cliente +";"+ "\nNúmero do pedido: #" + pedido.numberPedido + "\n\nDescrição do pedido: " + '\n' + newmsg + "\n\nEstimativa de Entrega: " + entrega_estimada +";" + "\n\nTotal: R$ " + total + "\n\nStatus: " + status;

    console.log(this.msg)

    setTimeout(() => {
      printJS({
        printable: 'printJS-form',
        type: 'html',
        header: 'Lavanderia Beltrão',  // Cabeçalho opcional
        style: '#printJS-form { border: 0; padding: 20px 0 0 20px; }'
      });
    }, 500);

    setTimeout(() => {
      textarea.classList.add('d-none');
      textarea.classList.remove('d-flex');
      textarea.innerHTML = '';
    }, 2000);

  }


  mobileCheck(){
    let check = false;
    // @ts-ignore
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  override resetar(): void {
    this.submitted = false;
    this.ocultarTodosSlots();
    this.formulario.reset();
    this.numPedido();
  }

  onBeforeSave(): void {
    let url = window.location.hash.slice(2);
    if(this.formulario.valid) {
      this.pedido = Object.entries(this.pedidosClientes);
      this.loopForTotais(this.vf, this.pedido)
      for (let i = 0; i < this.pedido.length; i++) {
        if(this.pedido[i][0].includes("valorFinal") && this.pedido[i][1] != null) {
          this.pedido[i][1] = this.pedido[i][1] + '';
          this.pedido[i][1] = parseFloat(this.pedido[i][1].replace(",", "."));
          this.pedido[i][1] =  parseFloat(this.pedido[i][1].toFixed(2));
          this.pedido[i][0] === "valorFinal" ? this.formulario.get('valorFinal')?.setValue(this.pedido[i][1]) : null;
        }
      }
      url == 'registrar-pedido' ? this.pedidosClientes = this.formulario.value : this.pedidosClientes;
      delete this.pedidosClientes.search;
    }
  }

  submit() {
    console.log(this.pedidosClientes)
    this.onBeforeSave();
    let save: any = document.querySelector('#salvar');
    let imp: any = document.querySelector('#imprimir');


    if(this.formulario.valid) {
      this.crudService.save(this.pedidosClientes).subscribe({
        next: () => {
          this.submitted ? this.onSuccess() : this.onSuccessEdit();
        },
        error: () => {
          this.onError()
        },
        complete: () => {
          this.resetar();
          this.numPedido();
        }
      })
    } else {
      this._snackBar.open('FORMULARIO INVALIDO!!!', '', {duration: 5000})
    }
  }

  private onSuccess() {
    this._snackBar.open('PEDIDO SALVO COM SUCESSO!!!', '', {duration: 5000});
  }
  private onSuccessEdit() {
    this._snackBar.open('PEDIDO EDITADO COM SUCESSO!!!', '', {duration: 5000});
    // Quem salva e esta instancia (o <app-formulario> filho), mas quem
    // renderiza a lista de resultados e o componente pai (PesquisaComponent,
    // que estende FormularioComponent com seu proprio arrPedidos/formulario
    // independentes) - emitir para o pai decidir como atualizar a lista dele.
    this.pedidoEditado.emit();
  }
  private onError() {
    this._snackBar.open('ERRO AO SALVAR PEDIDO!!!', '', {duration: 5000});
  }

}
