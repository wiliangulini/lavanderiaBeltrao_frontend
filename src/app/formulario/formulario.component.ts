import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, SimpleChanges, OnChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
import {HttpClient} from "@angular/common/http";
import {DataCrudService} from "../shared/services/data-crud.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormCadastroComponent} from "../form-cadastro/form-cadastro.component";
import * as printJS from 'print-js';


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
  @ViewChild('printJsForm', { static: false }) printJsForm: any;
  @ViewChild('imprimirBtn', { static: false }) imprimirBtn: any;
  @Input() arrPedidos: any = [];
  @Output() pedidoAtualizado = new EventEmitter<any>();
  @Input() showWhatsAppButton: boolean = true;
  showImprimirButton: boolean = false;

  vf: any = [];
  pedido: any = [];
  d: number = 0;
  classField: any;
  test: any;

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
      data: [null, Validators.required],
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
      total: [],
      retirada: [],
      valorFinal: [],
      pedidoRegistrado: [],
      pedidoPago: [],
      pedidoRetirado: [],
      itens: this.fb.array([]) // < - array de itens
    });
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta mudanças no @Input pedidosClientes
    if (changes['pedidosClientes'] && changes['pedidosClientes'].currentValue) {
      const data = changes['pedidosClientes'].currentValue;
      if (data.id) {
        this.carregarDadosPedido(data);
      }
    }
  }

  override  ngOnInit(): void {
    this.itens.valueChanges.subscribe(() => {
      this.calcularValorFinal();
    });
  }

  ngAfterViewInit(): void {
    let pes = document.getElementById('pesquisa');

    pes ? this.formulario.get('numberPedido')?.setValue('') : this.numPedido();
    pes ? this.submitted = false : this.submitted = true;
    !pes ? this.formulario.get('pedidoRegistrado')?.setValue(true) : this.formulario.get('pedidoRegistrado')?.setValue(false);

    let url = window.location.hash.slice(2);
    console.log(url);
    this.showImprimirButton = url !== 'registrar-pedido';
  }

  // Calcula o valor total do pedido somando os totais dos itens
  calcularValorFinal(): void {
    const total = this.itens.controls.reduce((acc, item) => {
      const valor = Number(item.get('total')?.value) || 0;
      return acc + valor;
    }, 0);

    this.formulario.get('valorFinal')?.setValue(total);
  }

  createItem(): FormGroup {
    return this.fb.group({
      id: [null], // Se for editar um item existente
      descricao: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      total: [null, Validators.required],
      retirada: [false]
    });
  }

  get itens(): FormArray {
    return this.formulario.get('itens') as FormArray;
  }

  addItem() {
    this.itens.push(this.createItem());
  }

  removeItem(index: number) {
    this.itens.removeAt(index);
  }

  carregarDadosPedido(data: any): void {
    console.log('Carregando dados no formulário:', data);

    // Converte o valorFinal
    const valorFinal = typeof data.valorFinal === 'object' ? Number(data.valorFinal.parsedValue) : Number(data.valorFinal);

    // Preencher campos principais
    this.formulario.patchValue({
      data: data.data,
      numberPedido: data.numberPedido,
      cliente: data.cliente,
      telefone: data.telefone,
      cep: data.cep || '',
      cidade: data.cidade || '',
      rua: data.rua || '',
      numCasa: data.numCasa || '',
      bairro: data.bairro || '',
      complemento: data.complemento || '',
      entrega_estimada: data.entrega_estimada || '',
      pedidoRegistrado: data.pedidoRegistrado,
      pedidoPago: data.pedidoPago,
      pedidoRetirado: data.pedidoRetirado,
      valorFinal: valorFinal
    });

    // Limpa o FormArray antes de preencher
    this.itens.clear();

    // Preenche o FormArray de itens
    if (data.itens && Array.isArray(data.itens)) {
      data.itens.forEach((item: any) => {
        const totalItem = typeof item.total === 'object' ? Number(item.total.parsedValue) : Number(item.total);

        const itemForm = this.fb.group({
          id: [item.id || null],
          descricao: [item.descricao, Validators.required],
          quantidade: [item.quantidade, [Validators.required, Validators.min(1)]],
          total: [totalItem, Validators.required],
          retirada: [item.retirada ?? false]
        });

        this.itens.push(itemForm);
      });
    }

    // Atualiza o pedidosClientes para outras funcionalidades
    this.pedidosClientes = data;

    // Atualiza o valor final calculado
    this.calcularValorFinal();

    // Força detecção de mudanças
    this.changeDetectorRef.detectChanges();
  }

  aplicaCssErroItem(index: number, campo: string) {
    const item = this.itens.at(index);
    return {
      'is-invalid': item.get(campo)?.invalid && item.get(campo)?.touched
    };
  }

  numPedido() {
    let num: any = [];
    this.crudService.list().subscribe((data: any) => {
        data.forEach((e: any) => {
          num.push(e.numberPedido)
        });
        if(num.length == 0) {
          this.np = 1;
        } else {
          num = num.sort((a: any, b: any) => a - b)
          this.np = num.pop();
          this.np++;
        }
        this.formulario.get('numberPedido')?.setValue(this.np);
      },
      error => {
        if (error.status === 500) {
          alert("Erro interno no servidor. Tente novamente mais tarde.");
        } else {
          alert("Erro inesperado: " + error.message);
        }
      }
    );
  }


  consultarCliente(event: any) {
    let cliente = event.target?.value.toLowerCase();
    console.log(cliente);
    if(cliente != null && cliente.length >= 3) {
      this.crudService.listClient().subscribe((data) => {
        data.forEach((e: any) => {
          console.log(e);
          let elm = e.cliente.toLowerCase();
          console.log(elm);
          let n = elm.indexOf(' ');
          console.log(n);
          let name = elm.slice(0, n);
          console.log(name);
          let mid = elm.slice(n+1);
          let md = mid.indexOf(' ');
          let midName = mid.slice(0, md);
          let lastName = mid.slice(md+1);
          console.log(midName);
          console.log(lastName);
          if((elm == cliente || name == cliente || midName == cliente || lastName == cliente) && this.pedidosClientes.pedidoRegistrado) {
            console.log(elm, cliente, name.includes(cliente))
            this.pedidosClientes = e;
            this.formulario.get('pedidoRegistrado')?.setValue(true);
            console.log(this.pedidosClientes)
          }
        });
      })
    }
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
    console.log(v);
    this.formulario.get(campo)?.setValue(v);
  }

  pesarRetirada(e: any) {
    let valor: any = e.target.checked;
    let _iden: any = e.target.id;
    this.formulario.get(_iden)?.setValue(valor);
    switch (_iden) {
      case 'retirada':
        this.formulario.get('total')?.setValue(0);
        this.calcularValorFinal();
        break;
    }
  }

  msg: any;

  enviarPedidoCliente(pedido: any) {
    let urlApi = "https://web.whatsapp.com/send";
    let celular: any = pedido.telefone;

    // Apenas numeros
    celular = celular.replace(/\D/g,'');
    // Verificar ddi, add se n tiver
    if(celular.length < 13){
      celular = "55" + celular;
    }

    // Calcular total e montar mensagem dos itens
    let valorTotal = 0;
    let itensMsg = '';

    if (pedido.itens && Array.isArray(pedido.itens)) {
      pedido.itens.forEach((item: any) => {
        const totalItem = Number(item.total) || 0;
        valorTotal += totalItem;

        if (item.retirada && totalItem === 0) {
          itensMsg += `\n${item.quantidade} ${item.descricao} = R$ ${totalItem.toFixed(2).replace(".", ",")}** pesagem na retirada, valor final irá mudar`;
        } else {
          itensMsg += `\n${item.quantidade} ${item.descricao} = R$ ${totalItem.toFixed(2).replace(".", ",")}`;
        }
      });
    }

    const total = valorTotal.toFixed(2).replace(".", ",");

    // Determinar status
    let status: string;
    if(pedido.pedidoRegistrado && pedido.pedidoPago && pedido.pedidoRetirado) {
      status = 'Pedido Registrado, Pago e Retirado pelo cliente;';
    } else if(pedido.pedidoRegistrado && pedido.pedidoPago) {
      status = 'Pedido Registrado e Pago;';
    } else if(pedido.pedidoRegistrado) {
      status = 'Pedido Registrado;';
    } else if(pedido.pedidoPago) {
      status = 'Pedido Pago;';
    } else {
      status = 'Aguardando registro;';
    }

    const msg = `Lavanderia Beltrão.\n\nCliente: ${pedido.cliente};\nNúmero do pedido: #${pedido.numberPedido}\n\nDescrição do pedido: ${itensMsg}\n\nEstimativa de Entrega: ${pedido.entrega_estimada || 'A definir'};\n\nTotal: R$ ${total}\n\nStatus: ${status}\n\nObs: não seguramos mercadoria mais de 60 dias!!!`;

    const msgEncode = window.encodeURIComponent(msg);

    if(this.mobileCheck()){
      urlApi = "https://api.whatsapp.com/send";
    }
    window.open(urlApi + "?phone=" + celular + "&text=" + msgEncode);
  }

  imprimir(pedido: any) {
    console.log(pedido)

    // Calcular total e montar mensagem dos itens
    let valorTotal = 0;
    let itensMsg = '';

    if (pedido.itens && Array.isArray(pedido.itens)) {
      pedido.itens.forEach((item: any) => {
        const totalItem = Number(item.total) || 0;
        valorTotal += totalItem;

        if (item.retirada && totalItem === 0) {
          itensMsg += `\n${item.quantidade} ${item.descricao} = R$ ${totalItem.toFixed(2).replace(".", ",")}** pesagem na retirada, valor final irá mudar`;
        } else {
          itensMsg += `\n${item.quantidade} ${item.descricao} = R$ ${totalItem.toFixed(2).replace(".", ",")}`;
        }
      });
    }

    const total = valorTotal.toFixed(2).replace(".", ",");

    // Determinar status
    let status: string;
    if(pedido.pedidoRegistrado && pedido.pedidoPago && pedido.pedidoRetirado) {
      status = 'Pedido Registrado, Pago e Retirado pelo cliente;';
    } else if(pedido.pedidoRegistrado && pedido.pedidoPago) {
      status = 'Pedido Registrado e Pago;';
    } else if(pedido.pedidoRegistrado) {
      status = 'Pedido Registrado;';
    } else if(pedido.pedidoPago) {
      status = 'Pedido Pago;';
    } else {
      status = 'Aguardando registro;';
    }

    if (this.printJsForm) {
      this.printJsForm.nativeElement.classList.add('d-flex');
      this.printJsForm.nativeElement.classList.remove('d-none');
    }

    this.msg = `Lavanderia Beltrão.\n\nCliente: ${pedido.cliente};\nNúmero do pedido: #${pedido.numberPedido}\n\nDescrição do pedido: ${itensMsg}\n\nEstimativa de Entrega: ${pedido.entrega_estimada || 'A definir'};\n\nTotal: R$ ${total}\n\nStatus: ${status}`;

    console.log(this.msg)

    setTimeout(() => {
      printJS({
        printable: 'printJS-form',
        type: 'html',
        header: 'Lavanderia Beltrão',
        style: '#printJS-form { border: 0; padding: 20px 0 0 20px; }'
      });
    }, 500);

    setTimeout(() => {
      if (this.printJsForm) {
        this.printJsForm.nativeElement.classList.add('d-none');
        this.printJsForm.nativeElement.classList.remove('d-flex');
        this.printJsForm.nativeElement.innerHTML = '';
      }
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
    this.formulario.reset();
    this.numPedido();
  }

  submit() {
    if(this.formulario.valid) {
      // Obter dados do formulário
      const dadosFormulario = this.formulario.value;

      // Para EDIÇÃO: mesclar com pedidosClientes (que contém o ID)
      // Para NOVO PEDIDO: usar apenas dados do formulário
      const dadosAtualizados = this.pedidosClientes?.id
        ? { ...this.pedidosClientes, ...dadosFormulario }
        : dadosFormulario;

      // Remover campo 'search' se existir (não faz parte do modelo backend)
      delete dadosAtualizados.search;

      console.log('Dados a serem enviados:', dadosAtualizados);

      this.crudService.save(dadosAtualizados).subscribe({
        next: (data: any) => {
          console.log('Resposta do backend:', data);
          this.submitted ? this.onSuccess() : this.onSuccessEdit();

          // Emitir evento para atualizar a lista no componente pai (somente em edição)
          if (dadosAtualizados.id) {
            this.pedidoAtualizado.emit(data);
          }
        },
        error: (error) => {
          console.error('Erro ao salvar:', error);
          this.onError();
        },
        complete: () => {
          this.resetar();
          this.numPedido();
        }
      });
    } else {
      this._snackBar.open('FORMULARIO INVALIDO!!!', '', {duration: 5000});
      this.formulario.markAllAsTouched();
    }
  }

  private onSuccess() {
    this._snackBar.open('PEDIDO SALVO COM SUCESSO!!!', '', {duration: 5000});
  }
  private onSuccessEdit() {
    this._snackBar.open('PEDIDO EDITADO COM SUCESSO!!!', '', {duration: 5000});
  }
  private onError() {
    this._snackBar.open('ERRO AO SALVAR PEDIDO!!!', '', {duration: 5000});
  }

}
