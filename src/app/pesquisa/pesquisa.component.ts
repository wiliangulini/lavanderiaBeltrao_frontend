import {DataCrudService} from '../shared/services/data-crud.service';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormularioComponent} from "../formulario/formulario.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.scss']
})
export class PesquisaComponent implements OnInit {

  @ViewChild(FormularioComponent) formularioChild!: FormularioComponent;

  formulario: any;
  arrPedidos: any = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private crudService: DataCrudService,
    private cepService: ConsultaCepService,
    private _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formulario = this.fb.group({
      search: []
    });
  }

  ngOnInit(): void {}

  searchPedido() {
    let dt = this.formulario.get('search')?.value;
    this.arrPedidos = [];
    if (!dt) return;

    dt = dt.toLowerCase();
    this.crudService.list().subscribe((data) => {
        data.forEach((e: any) => {
          let elm = e.cliente.toLowerCase();
          if(elm.includes(dt) || e.numberPedido == dt || e.telefone == dt) {
            this.arrPedidos.push(e);
          }
        });
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

  onEdit(id: any): void {
    this.crudService.findById(id).subscribe((data: any) => {
      console.log('Dados recebidos:', data);

      // Passa os dados para o child component
      if (this.formularioChild) {
        this.formularioChild.carregarDadosPedido(data);
      }
    });
  }

  onRemove(id: any) {
    this.crudService.remove(id).subscribe(() => {
      this._snackBar.open('PEDIDO REMOVIDO COM SUCESSO!!!', '', {duration: 4000});
      this.searchPedido();
    });
  }

  atualizarPedidoNaLista(pedidoAtualizado: any): void {
    console.log('Atualizando pedido na lista:', pedidoAtualizado);

    // Encontra o índice do pedido na lista
    const index = this.arrPedidos.findIndex((p: any) => p.id === pedidoAtualizado.id);

    if (index !== -1) {
      // Atualiza o pedido na lista com os dados atualizados
      this.arrPedidos[index] = pedidoAtualizado;

      // Força a detecção de mudanças
      this.changeDetectorRef.detectChanges();

      console.log('Pedido atualizado na lista:', this.arrPedidos[index]);
    }
  }

}
