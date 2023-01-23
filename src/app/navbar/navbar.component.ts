import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('resPed') control: any;

  ngOnInit(): void {
  }

  edit(): void {
    if (this.control.nativeElement.className == "nav-link active") {
      setTimeout(() => window.location.reload(), 500);
    }
  }
}
